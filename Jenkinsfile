pipeline {
    agent any

    tools {
        jdk 'JDK21'
        maven 'Maven3'
    }

    stages {
        stage('Build') {
            steps {
                bat 'mvn clean package -DskipTests'
            }
        }

        stage('Test') {
            steps {
                bat 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Deploy') {
            steps {
                bat(script: 'for /f "tokens=5" %%a in (\'netstat -aon ^| findstr :8082 ^| findstr LISTENING\') do taskkill /F /PID %%a', returnStatus: true)
                withEnv(['JENKINS_NODE_COOKIE=dontKillMe', 'BUILD_ID=dontKillMe']) {
                    bat 'start /B java -jar target/caesar-springboot-1.0.jar > app.log 2>&1'
                }
                sleep 15
            }
        }
    }
}