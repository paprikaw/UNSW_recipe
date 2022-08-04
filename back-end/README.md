## Steps to setup enviroment:

Note: This instruction is only worked under lubuntu

Firstly you need to install pip in lubuntu:
```
sudo apt-get install python3-pip
```

In the back-end directory:
``` 
sudo apt install python3-virtualenv
``` 
to create your new environment (called 'venv' here)
``` 
virtualenv venv 
``` 
to enter the virtual environment
``` 
source venv/bin/activate 
``` 
to install the requirements in the current environment
``` 
pip install -r requirements.txt 
```

If you update your module in this project, you should always do:
``` 
pip freeze > requirements.txt
```

Note:

* `source venv/bin/activate` only works on current shell session, if you want to close the current python enviroment, simply restart shell. 

* Do not include any actual dependencies in the repo. Virtualenv should create a enviroment folder with dependecies in it, it will automatically create a .gitignore and ingnore any package files for you.

* Always remember to update requirements.txt before pushing updates to remote repo:

* Only update requirements.txt when you in the right environment this.


For more details, please refer to https://stackoverflow.com/a/41799834/13739428
