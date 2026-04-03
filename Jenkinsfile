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

        // ✅ FIX 1: Always init before checking output.
        // -reconfigure avoids migration prompts entirely.
        // We suppress stdout noise but let real errors surface.
stage('Check EC2 Exists') {
    steps {
        script {
            def ip = sh(
                script: """
                    cd terraform
                    rm -rf .terraform .terraform.lock.hcl
                    terraform init -reconfigure -input=false > /dev/null 2>&1
                    terraform output -raw public_ip 2>/dev/null || echo ""
                """,
                returnStdout: true
            ).trim()

            env.EC2_EXISTS = (ip ==~ /\d+\.\d+\.\d+\.\d+/) ? "true" : "false"
            env.EC2_IP = ip
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
                sh '''
                    rm -rf .terraform .terraform.lock.hcl
                    terraform init -reconfigure -input=false
                    terraform apply -auto-approve -input=false
                '''
            }
        }
    }
}
        // ✅ FIX 4: Only fetch IP if we didn't already grab it in Check EC2 Exists.
        // This stage runs regardless of which path was taken.
        stage('Get EC2 IP') {
            when {
                expression { env.EC2_EXISTS != "true" }
            }
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