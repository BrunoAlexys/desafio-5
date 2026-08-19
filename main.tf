terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  
  endpoints {
    ec2 = "http://localhost:4566"
  }
}

resource "aws_security_group" "api_sg" {
  name        = "api_security_group"
  description = "Permite acesso a porta 3000 e saida total"

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "api_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu Server 22.04 LTS (HVM) no us-east-1
  instance_type = "t2.micro"
  
  vpc_security_group_ids = [aws_security_group.api_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              # 1. Preparação: Atualizar a lista de pacotes do Linux e instalar o interpretador do Node.js
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg
              mkdir -p /etc/apt/keyrings
              curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
              echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
              apt-get update -y
              apt-get install -y nodejs
              
              # 2. Organização: Criar uma pasta específica no servidor
              mkdir -p /app/src/controllers
              mkdir -p /app/src/routes
              
              # 3. Injeção de Código: Usar funções nativas do Terraform (file) para ler e escrever os arquivos
              cat << 'EOT' > /app/package.json
              ${file("package.json")}
              EOT
              
              cat << 'EOT' > /app/src/app.js
              ${file("src/app.js")}
              EOT
              
              cat << 'EOT' > /app/src/server.js
              ${file("src/server.js")}
              EOT
              
              cat << 'EOT' > /app/src/controllers/user.controller.js
              ${file("src/controllers/user.controller.js")}
              EOT
              
              cat << 'EOT' > /app/src/routes/user.routes.js
              ${file("src/routes/user.routes.js")}
              EOT
              
              # 4. Execução: Instalar dependências e rodar a aplicação em segundo plano
              cd /app
              npm install
              nohup npm start > app.log 2>&1 &
              EOF

  tags = {
    Name = "NodeAPIServer"
  }
}
