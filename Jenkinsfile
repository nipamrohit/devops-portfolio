pipeline {
    agent any

    environment {
        IMAGE_NAME = "nipamrohit121/devops-portfolio"
    }

    stages {

        stage('Get Version') {
            steps {
                script {
                    env.TAG = "v${BUILD_NUMBER}"
                }
            }
        }

        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/nipamrohit/devops-portfolio.git'
            }
        }

        // stage('Build Docker Image') {
        //     steps {
        //         sh 'docker build -t $IMAGE_NAME:$TAG .'
        //     }
        // }

        // stage('Trivy Scan + Report') {
        //     steps {
        //         sh '''
        //             mkdir -p templates
        //             curl -s -o templates/custom.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl
        //             trivy image \
        //             --severity HIGH,CRITICAL \
        //             --ignore-unfixed \
        //             --format template \
        //             --template "@templates/custom.tpl" \
        //             -o trivy-report.html \
        //             $IMAGE_NAME:$TAG
        //         '''
        //     }
        // }

        // stage('Publish Trivy Report') {
        //     steps {
        //         publishHTML([
        //             reportName: 'Trivy Security Report',
        //             reportDir: '.',
        //             reportFiles: 'trivy-report.html',
        //             keepAll: true,
        //             alwaysLinkToLastBuild: true,
        //             allowMissing: false
        //         ])
        //     }
        // }

        // stage('Approve Push') {
        //     steps {
        //         input message: "Check Trivy Report → Push ${TAG}?"
        //     }
        // }

        // stage('Docker Login & Push') {
        //     steps {
        //         withCredentials([usernamePassword(
        //             credentialsId: 'dockerhub',
        //             usernameVariable: 'DOCKER_USER',
        //             passwordVariable: 'DOCKER_PASS'
        //         )]) {
        //             sh '''
        //                 echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
        //                 docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:latest
        //                 docker push $IMAGE_NAME:$TAG
        //                 docker push $IMAGE_NAME:latest
        //             '''
        //         }
        //     }
        // }

        stage('Terraform Plan & Apply') {
            steps {
                dir('terraform') {
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-creds',
                        accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                        secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                    ]]) {
                        script {
                            sh '''
                                rm -rf .terraform .terraform.lock.hcl terraform.tfstate terraform.tfstate.backup
                                terraform init -reconfigure -input=false
                                terraform apply -auto-approve -input=false
                            '''
                            env.EC2_IP = sh(
                                script: 'terraform output -raw public_ip',
                                returnStdout: true
                            ).trim()
                            echo "EC2_IP=${env.EC2_IP}"
                        }
                    }
                }
            }
        }

        // stage('Approve Deployment') {
        //     steps {
        //         input message: "Deploy ${TAG} to EC2 (${EC2_IP})?"
        //     }
        // }

        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-key',
                    keyFileVariable: 'KEY'
                )]) {
                    sh '''
                        echo "[web]" > ansible/inventory.ini
                        echo "$EC2_IP ansible_user=ubuntu ansible_ssh_private_key_file=$KEY" >> ansible/inventory.ini

                        for i in {1..12}; do
                          ssh -o StrictHostKeyChecking=no -i $KEY ubuntu@$EC2_IP "echo ready" && break
                          echo "Waiting for SSH..."
                          sleep 10
                        done

                        ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
                        --extra-vars "image_name=$IMAGE_NAME:$TAG"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed"
        }

        success {
            emailext(
                mimeType: 'text/html',
                subject: "✅ Jenkins CI/CD Success | ${JOB_NAME} #${BUILD_NUMBER}",
                body: """
                <html>
                <body style="font-family:Arial,sans-serif; background-color:#f4f6f8; padding:20px;">
                    <div style="max-width:700px; background:#ffffff; padding:30px; border-radius:8px; border-top:5px solid #28a745;">

                        <h2 style="color:#28a745; margin-top:0;">✅ Deployment Successful</h2>
                        <p style="color:#555;">The Jenkins pipeline completed successfully. Your app is live.</p>

                        <table width="100%" cellpadding="10" cellspacing="0"
                               style="border-collapse:collapse; border:1px solid #ddd; margin-top:16px;">
                            <tr style="background:#f0fff4;">
                                <td width="35%" style="border:1px solid #ddd;"><b>Project</b></td>
                                <td style="border:1px solid #ddd;">${JOB_NAME}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Build Number</b></td>
                                <td style="border:1px solid #ddd;">#${BUILD_NUMBER}</td>
                            </tr>
                            <tr style="background:#f0fff4;">
                                <td style="border:1px solid #ddd;"><b>Build Status</b></td>
                                <td style="border:1px solid #ddd; color:#28a745;"><b>✅ SUCCESS</b></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Docker Image</b></td>
                                <td style="border:1px solid #ddd;">${IMAGE_NAME}:${TAG}</td>
                            </tr>
                            <tr style="background:#f0fff4;">
                                <td style="border:1px solid #ddd;"><b>EC2 Public IP</b></td>
                                <td style="border:1px solid #ddd;">${EC2_IP}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Node</b></td>
                                <td style="border:1px solid #ddd;">${NODE_NAME}</td>
                            </tr>
                            <tr style="background:#f0fff4;">
                                <td style="border:1px solid #ddd;"><b>Live App</b></td>
                                <td style="border:1px solid #ddd;">
                                    <a href="http://${EC2_IP}" style="color:#007bff;">http://${EC2_IP}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Build URL</b></td>
                                <td style="border:1px solid #ddd;">
                                    <a href="${BUILD_URL}" style="color:#007bff;">${BUILD_URL}</a>
                                </td>
                            </tr>
                            <tr style="background:#f0fff4;">
                                <td style="border:1px solid #ddd;"><b>Console Logs</b></td>
                                <td style="border:1px solid #ddd;">
                                    <a href="${BUILD_URL}console" style="color:#007bff;">${BUILD_URL}console</a>
                                </td>
                            </tr>
                        </table>

                        <br>
                        <p style="color:#555;">
                            🚀 Your application has been deployed and is accessible at
                            <a href="http://${EC2_IP}" style="color:#28a745;"><b>http://${EC2_IP}</b></a>
                        </p>

                        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
                        <p style="font-size:12px; color:#999; margin:0;">
                            Jenkins CI/CD Automated Notification &nbsp;|&nbsp;
                            This is an auto-generated email. Do not reply.
                        </p>
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
                <body style="font-family:Arial,sans-serif; background-color:#f4f6f8; padding:20px;">
                    <div style="max-width:700px; background:#ffffff; padding:30px; border-radius:8px; border-top:5px solid #d9534f;">

                        <h2 style="color:#d9534f; margin-top:0;">❌ Build Failed</h2>
                        <p style="color:#555;">The Jenkins pipeline has <b>failed</b>. Please review the logs below.</p>

                        <table width="100%" cellpadding="10" cellspacing="0"
                               style="border-collapse:collapse; border:1px solid #ddd; margin-top:16px;">
                            <tr style="background:#fff5f5;">
                                <td width="35%" style="border:1px solid #ddd;"><b>Project</b></td>
                                <td style="border:1px solid #ddd;">${JOB_NAME}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Build Number</b></td>
                                <td style="border:1px solid #ddd;">#${BUILD_NUMBER}</td>
                            </tr>
                            <tr style="background:#fff5f5;">
                                <td style="border:1px solid #ddd;"><b>Build Status</b></td>
                                <td style="border:1px solid #ddd; color:#d9534f;"><b>❌ FAILED</b></td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Docker Image</b></td>
                                <td style="border:1px solid #ddd;">${IMAGE_NAME}:${TAG}</td>
                            </tr>
                            <tr style="background:#fff5f5;">
                                <td style="border:1px solid #ddd;"><b>Node</b></td>
                                <td style="border:1px solid #ddd;">${NODE_NAME}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Workspace</b></td>
                                <td style="border:1px solid #ddd;">${WORKSPACE}</td>
                            </tr>
                            <tr style="background:#fff5f5;">
                                <td style="border:1px solid #ddd;"><b>Build URL</b></td>
                                <td style="border:1px solid #ddd;">
                                    <a href="${BUILD_URL}" style="color:#007bff;">${BUILD_URL}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd;"><b>Console Logs</b></td>
                                <td style="border:1px solid #ddd;">
                                    <a href="${BUILD_URL}console" style="color:#007bff;">${BUILD_URL}console</a>
                                </td>
                            </tr>
                        </table>

                        <br>
                        <p style="color:#555;">
                            👉 Please review the console logs to identify the root cause of the failure.
                        </p>

                        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
                        <p style="font-size:12px; color:#999; margin:0;">
                            Jenkins CI/CD Automated Notification &nbsp;|&nbsp;
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