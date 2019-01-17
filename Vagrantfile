Vagrant.configure(2) do |config|

    config.vm.box = "ubuntu/trusty64"
    config.vm.provision :shell, :inline => "curl -sL https://deb.nodesource.com/setup_9.x | bash - && apt-get -y install nodejs"

end