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
                        message: 'Enter Docker Image Version (e.g., v1, v2):',
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

        stage('Trivy Scan') {
            steps {
                sh '''
                trivy image --severity HIGH,CRITICAL --ignore-unfixed $IMAGE_NAME:$TAG || true
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
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

        // ------------------ TERRAFORM ------------------

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

                    echo "EC2 IP: ${EC2_IP}"
                }
            }
        }

        // ------------------ ANSIBLE ------------------

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
                sh '''
                echo "Waiting for EC2 to be ready..."
                sleep 60
                '''
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
            echo "Deployment Successful! Access app at http://$EC2_IP"
        }
        failure {
            echo "Pipeline Failed!"
        }
    }
}