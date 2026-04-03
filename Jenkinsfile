pipeline {
    agent any

    environment {
        IMAGE_NAME = "nipamrohit121/devops-portfolio"
        TAG = "latest"
    }


    stages {

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

        stage('Trivy Scan (HTML Report)') {
            steps {
                sh '''
                trivy image \
                --format template \
                --template "@/usr/local/share/trivy/templates/html.tpl" \
                -o trivy-report.html \
                $IMAGE_NAME:$TAG
                '''
            }
        }

        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'trivy-report.html', fingerprint: true
            }
        }

        stage('Approve Push to DockerHub') {
            steps {
                input message: 'Do you want to push image to DockerHub?'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $IMAGE_NAME:$TAG'
            }
        }
    }
}