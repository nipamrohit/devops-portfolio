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

        // stage('Build Docker Image') {
        //     steps {
        //         sh 'docker build -t $IMAGE_NAME:$TAG .'
        //     }
        // }

        // stage('Trivy Scan + Report') {
        //     steps {
        //         sh '''
        //         mkdir -p templates
        //         curl -s -o templates/custom.tpl https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl

        //         trivy image \
        //         --severity HIGH,CRITICAL \
        //         --ignore-unfixed \
        //         --format template \
        //         --template "@templates/custom.tpl" \
        //         -o trivy-report.html \
        //         $IMAGE_NAME:$TAG
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

        // stage('Docker Login') {
        //     steps {
        //         withCredentials([usernamePassword(
        //             credentialsId: 'dockerhub',
        //             usernameVariable: 'DOCKER_USER',
        //             passwordVariable: 'DOCKER_PASS'
        //         )]) {
        //             sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
        //         }
        //     }
        // }

        // stage('Push Image') {
        //     steps {
        //         sh '''
        //         docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:latest
        //         docker push $IMAGE_NAME:$TAG
        //         docker push $IMAGE_NAME:latest
        //         '''
        //     }
        // }

        stage('Check EC2 Exists') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-creds',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    script {
                        def ip = sh(
                            script: """
                                cd terraform
                                rm -rf .terraform .terraform.lock.hcl terraform.tfstate terraform.tfstate.backup
                                terraform init -reconfigure -input=false 2>&1 | tail -5
                                terraform output -raw public_ip 2>/dev/null || echo ""
                            """,
                            returnStdout: true
                        ).trim()

                        // Only last line matters — the IP (init output goes to tail -5 above)
                        def lines = ip.split('\n')
                        def lastLine = lines[-1].trim()

                        env.EC2_EXISTS = (lastLine ==~ /\d+\.\d+\.\d+\.\d+/) ? "true" : "false"
                        env.EC2_IP = lastLine
                        echo "EC2_EXISTS=${env.EC2_EXISTS}, EC2_IP=${env.EC2_IP}"
                    }
                }
            }
        }

        stage('Terraform Init & Apply') {
            when {
                expression { env.EC2_EXISTS != "true" }
            }
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
                            // Capture IP while credentials are still active
                            env.EC2_IP = sh(
                                script: "terraform output -raw public_ip",
                                returnStdout: true
                            ).trim()
                            echo "EC2_IP=${env.EC2_IP}"
                        }
                    }
                }
            }
        }

        stage('Approve Deployment') {
            steps {
                input message: "Deploy ${TAG} to EC2 (${EC2_IP})?"
            }
        }

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

        stage('Wait for EC2 SSH') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'ec2-key',
                    keyFileVariable: 'KEY'
                )]) {
                    sh '''
                        for i in {1..12}; do
                          ssh -o StrictHostKeyChecking=no -i $KEY ubuntu@$EC2_IP "echo ready" && break
                          echo "Waiting for SSH..."
                          sleep 10
                        done
                    '''
                }
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
        always {
            echo "Pipeline completed"
        }

        success {
            emailext(
                mimeType: 'text/html',
                subject: "✅ Jenkins CI/CD Success | ${JOB_NAME} #${BUILD_NUMBER}",
                body: "<h2 style='color:green;'>Deployment Successful</h2><p>App: http://${EC2_IP}</p>",
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