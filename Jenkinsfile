node {
    if (BRANCH_NAME == "main") {
    def app
        stage('init work') {
        /* Cloning the Repository to our Workspace */
        echo 'start pipeline'
    }
    stage('Clone repository') {
        /* Cloning the Repository to our Workspace */
        checkout scm
    }

    stage('Build image') {
    //    app = docker.build("reformtracker_front")
          app = docker.build("morocco_jobs")
    }


    stage('Push image to phd registry') {
        /* 
			You would need to first register with DockerHub before you can push images to your account
		*/
        docker.withRegistry('http://localhost:5000') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
            } 
                echo "Trying to Push Docker"
    }
    stage('send  and exécute docker compose to swarm') {
    sshPublisher(
publishers: 
[sshPublisherDesc(
    configName: 'phd',
     transfers: [sshTransfer(
         cleanRemote: false, 
         excludes: '', 
// execCommand: "sudo docker stack deploy --compose-file /home/ubuntu/projects/refrom/reform-front/docker-compose.yml reform",
// execCommand: "sudo docker stack deploy --compose-file /root/projects/morocco_jobs/docker-compose.yml phd",
execCommand: "sudo docker stack deploy --compose-file /home/ghassane/projects/compose-files/jobs-scraper/docker-compose.yml phd",
//    execCommand:"echo test",
  execTimeout: 120000, 
      flatten: false, 
      makeEmptyDirs: true, 
      noDefaultExcludes: false, 
      patternSeparator: '[, ]+', 
      remoteDirectory: '/projects/morocco_jobs', 
      remoteDirectorySDF: false, 
      removePrefix: '', 
      sourceFiles: '**/docker-compose.yml')], 
      usePromotionTimestamp: false, 
      useWorkspaceInPromotion: false, 
      verbose: true)])
    }
}}