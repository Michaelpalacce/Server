def notifyBuild(String buildStatus = 'STARTED') {
  // build status of null means successful
  buildStatus =  buildStatus ?: 'SUCCESSFUL'

  emailext (
      subject: "${buildStatus}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      to: '$DEFAULT_RECIPIENTS',
      body: """
STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':

Check console output at "${env.JENKINS_URL}/job/${env.JOB_NAME}/${env.BUILD_NUMBER}"
"""
    )
}
def notifySuccessful() {
  emailext (
      subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      to:'$DEFAULT_RECIPIENTS',
      body: """
SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':

Check console output at "${env.JENKINS_URL}/job/${env.JOB_NAME}/${env.BUILD_NUMBER}"
"""
    )
}

pipeline {
	agent none
	parameters {
		booleanParam(name: 'publish', defaultValue: false, description: 'Do you want to publish to npm?')
		booleanParam(name: 'dockerpush', defaultValue: true, description: 'Do you want to build and push to dockerhub')
	}

	post{
		failure{
			notifyBuild("FAILED")
		}
		success{
			notifySuccessful()
		}
	}

	stages {
		stage( 'Build and Publish' ) {
			agent { label 'nodejs-16' }
			when {
				beforeAgent true;
				expression{
					return publish.toBoolean()
				}
			}
			steps {
				script {
					withCredentials([string(credentialsId: 'npm-access-token', variable: 'NPMTOKEN')]) {
						sh """
							npm ci
							echo "//registry.npmjs.org/:_authToken=$NPMTOKEN" >> ~/.npmrc
							npm publish
						"""
					}
				}
			}
		}
		stage( 'Docker push' ) {
			agent { label 'docker-builder' }
			when {
				beforeAgent true;
				expression{
					return dockerpush.toBoolean()
				}
			}
			steps {
				script {
					withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'password', usernameVariable: 'username')]) {
						sh """
							docker login -u $username -p $password
							docker buildx install
							docker buildx create --use
							./BUILD
						"""
					}
				}
			}
		}
	}
}
