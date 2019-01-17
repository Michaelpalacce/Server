Vagrant.configure(2) do |config|

    config.vm.box = "ubuntu/trusty64"
    config.vm.network "forwarded_port", guest: 3000, host: 3000
    config.vm.provision :shell, :inline => "curl -sL https://deb.nodesource.com/setup_9.x | bash - && apt-get -y install nodejs"
    config.vm.provider "virtualbox" do |v|
        v.memory = 2048
        v.cpus = 2
    end

end