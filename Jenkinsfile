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
def notifyFailed() {
  emailext (
      subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      to: '$DEFAULT_RECIPIENTS',
      body: """
FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':

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

Open: https://stefangenov.site to check out your new settings!

Check console output at "${env.JENKINS_URL}/job/${env.JOB_NAME}/${env.BUILD_NUMBER}"
"""
    )
}

pipeline {
	agent none

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
	}
}
