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

        // 🔥 TRIVY BACK (FORMATTED)
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
                    alwaysLinkToLastBuild: true
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

        // 🔥 AWS FIX
        stage('AWS Credentials Setup') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh 'echo "AWS creds loaded"'
                }
            }
        }

        // 🔥 TERRAFORM
        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    sh 'terraform apply -auto-approve'
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

    // 🔥 EMAIL (YOUR FORMAT APPLIED)
    post {
        success {
            emailext(
                mimeType: 'text/html',
                subject: "✅ Jenkins CI/CD Success | ${JOB_NAME} #${BUILD_NUMBER}",
                body: "<h2 style='color:green;'>Deployment Successful!</h2><p>App: http://${EC2_IP}</p>",
                to: "nipamrohit121@gmail.com"
            )
        }

        failure {
            emailext(
                mimeType: 'text/html',
                subject: "❌ Jenkins CI/CD Failure | ${JOB_NAME} #${BUILD_NUMBER}",
                body: "<h2 style='color:red;'>Pipeline Failed</h2><p>Check logs: ${BUILD_URL}</p>",
                to: "nipamrohit121@gmail.com"
            )
        }
    }
}