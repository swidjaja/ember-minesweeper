pipeline {
    agent {
        docker { image 'node:10-alpine' }
    }
    stages {
        stage('Build') {
            steps {
                sh '''
                  node --version
                  yarn
                '''
            }
        }
        stage('Test') {
            steps {
                sh 'yarn test'
            }
        }
    }
}