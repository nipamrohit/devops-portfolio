pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        IMAGE_NAME = "nipamrohit121/devops-portfolio"
    }

    stages {

        stage('Get Version') {
            steps {
                script {
                    env.TAG = input(
                        message: 'Enter Docker Image Version (v1, v2)',
                        parameters: [string(name: 'VERSION', defaultValue: 'v1')]
                    )
                }
            }
        }

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/nipamrohit/devops-portfolio.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$TAG .'
            }
        }

        // 🔥 TRIVY
        stage('Trivy Scan + Report') {
            steps {
                sh '''
                mkdir -p templates
                curl -s -o templates/custom.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl

                trivy image \
                --severity HIGH,CRITICAL \
                --ignore-unfixed \
                --format template \
                --template "@templates/custom.tpl" \
                -o trivy-report.html \
                $IMAGE_NAME:$TAG
                '''
            }
        }

        stage('Publish Trivy Report') {
            steps {
                publishHTML([
                    reportName: 'Trivy Security Report',
                    reportDir: '.',
                    reportFiles: 'trivy-report.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }

        stage('Approve Push') {
            steps {
                input message: "Check Trivy Report → Push ${TAG}?"
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:latest
                docker push $IMAGE_NAME:$TAG
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        // 🔥 FIXED TERRAFORM (WITH AWS CREDS)
        stage('Terraform Init & Apply') {
            steps {
                dir('terraform') {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-creds',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]]) {
                        sh '''
                        terraform init
                        terraform apply -auto-approve -input=false
                        '''
                    }
                }
            }
        }

        stage('Get EC2 IP') {
            steps {
                script {
                    env.EC2_IP = sh(
                        script: "cd terraform && terraform output -raw public_ip",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Approve Deployment') {
            steps {
                input message: "Deploy ${TAG} to EC2 (${EC2_IP})?"
            }
        }

        // 🔥 ANSIBLE
        stage('Create Inventory') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-key',
                    keyFileVariable: 'KEY'
                )]) {
                    sh '''
                    echo "[web]" > ansible/inventory.ini
                    echo "$EC2_IP ansible_user=ubuntu ansible_ssh_private_key_file=$KEY" >> ansible/inventory.ini
                    '''
                }
            }
        }

        stage('Wait for EC2') {
            steps {
                sh 'sleep 60'
            }
        }

        stage('Ansible Deploy') {
            steps {
                sh '''
                ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
                --extra-vars "image_name=$IMAGE_NAME:$TAG"
                '''
            }
        }
    }

    post {
        success {
            emailext(
                mimeType: 'text/html',
                subject: "✅ Jenkins CI/CD Success | ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
                <html>
                <body style="font-family: Arial; background:#f4f6f8; padding:20px;">
                    <div style="background:#fff; padding:20px; border-radius:8px;">
                        <h2 style="color:green;">Deployment Successful</h2>
                        <p><b>App URL:</b> <a href="http://${EC2_IP}">http://${EC2_IP}</a></p>
                    </div>
                </body>
                </html>
                """,
                to: "nipamrohit121@gmail.com"
            )
        }

        failure {
            emailext(
                mimeType: 'text/html',
                subject: "❌ Jenkins CI/CD Failure | ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
                <html>
                <body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
                    <div style="max-width:700px; background:#ffffff; padding:20px; border-radius:8px;">

                        <h2 style="color:#d9534f;">❌ Build Failed</h2>
                        <p>The Jenkins pipeline execution has <b>FAILED</b>. Details are below:</p>

                        <table width="100%" cellpadding="8" cellspacing="0"
                               style="border-collapse:collapse; border:1px solid #ddd;">
                            <tr style="background:#f0f0f0;">
                                <td><b>Project Name</b></td>
                                <td>${JOB_NAME}</td>
                            </tr>
                            <tr>
                                <td><b>Build Number</b></td>
                                <td>#${BUILD_NUMBER}</td>
                            </tr>
                            <tr style="background:#f0f0f0;">
                                <td><b>Build Status</b></td>
                                <td style="color:#d9534f;"><b>FAILED</b></td>
                            </tr>
                            <tr>
                                <td><b>Executed On Node</b></td>
                                <td>${NODE_NAME}</td>
                            </tr>
                            <tr style="background:#f0f0f0;">
                                <td><b>Workspace</b></td>
                                <td>${WORKSPACE}</td>
                            </tr>
                            <tr>
                                <td><b>Docker Image</b></td>
                                <td>${IMAGE_NAME}</td>
                            </tr>
                            <tr style="background:#f0f0f0;">
                                <td><b>Build URL</b></td>
                                <td><a href="${BUILD_URL}">${BUILD_URL}</a></td>
                            </tr>
                            <tr>
                                <td><b>Console Logs</b></td>
                                <td><a href="${BUILD_URL}console">${BUILD_URL}console</a></td>
                            </tr>
                        </table>

                        <br>

                        <p style="color:#555;">
                            👉 Please review the console logs to identify the root cause of the failure.
                        </p>

                        <hr>

                        <p style="font-size:12px; color:#999;">
                            Jenkins CI/CD Automated Notification<br>
                            This is an auto-generated email. Do not reply.
                        </p>
                    </div>
                </body>
                </html>
                """,
                to: "nipamrohit121@gmail.com"
            )
        }
    }
}