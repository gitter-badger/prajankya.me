#!/bin/bash

checkInstalled(){
  #echo "$1";
  if hash $1 2>/dev/null; then
    return 0
  else
    return 1
  fi
}

if checkInstalled "wkhtmltopdf"; then
    echo 'wkhtmltopdf Installed already'
  else
    echo 'wkhtmltopdf Not Installed, Installing'
    sudo apt-get install xvfb
    cd ~/
    if [ ! -f "wkhtmltox-0.12.3_linux-generic-amd64.tar.xz" ]; then
      echo "Not found"
      wget http://download.gna.org/wkhtmltopdf/0.12/0.12.3/wkhtmltox-0.12.3_linux-generic-amd64.tar.xz
    fi
    if [ ! -d "wkhtmltox" ]; then
      tar -xf wkhtmltox-0.12.3_linux-generic-amd64.tar.xz
    fi
    cd wkhtmltox
    cd bin
    export PATH="$PATH:$HOME/wkhtmltox/bin"

    #echo 'export PATH="$PATH:$HOME/wkhtmltox/bin"'>> ~/.profile
    #source ~/.profile

    echo 'export PATH="$PATH:$HOME/wkhtmltox/bin"'>> ~/.bashrc
    source ~/.bashrc

    if checkInstalled "wkhtmltopdf"; then
      echo 'wkhtmltopdf Installed Successfully'
    else
      echo 'wkhtmltopdf Install had some PROBLEM, Exiting'
    fi
fi
