# SAS FS - Sistema de Gerenciamento de Arquivos SAS

O **SAS FS** é uma plataforma moderna e intuitiva para o gerenciamento de servidores de arquivos Samba em Linux. Ele permite a criação de compartilhamentos, controle de cotas de disco, monitoramento em tempo real e notificações via SMTP/SNMP.

## 🚀 Funcionalidades

- **Dashboard de Infraestrutura**: Visualize o uso real do disco e a saúde do sistema.
- **Gerenciamento de Shares**: Crie, edite e remova compartilhamentos Samba com facilidade.
- **Controle de Cotas**: Defina limites de armazenamento por pasta.
- **Monitoramento de Saúde**: Alertas automáticos para níveis críticos de armazenamento.
- **Gestão de Usuários**: Controle de acesso completo com níveis Administrador e Usuário.
- **Notificações**: Configuração integrada de alertas via E-mail (SMTP) e SNMP.

## 🛠️ Requisitos do Sistema

- **Sistema Operacional**: Ubuntu 22.04+ ou Debian 11+.
- **Privilégios**: Acesso root (sudo).
- **Conexão**: Acesso à internet para baixar dependências durante a instalação.

## 📥 Instalação Rápida

Para instalar o sistema completo em um servidor novo, siga os passos abaixo:

1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/jorgeazevedo98-rgb/sasfs.git
   cd sasfs
   ```

2. **Dê permissão ao script de instalação**:
   ```bash
   chmod +x install.sh
   ```

3. **Execute a instalação**:
   ```bash
   sudo ./install.sh
   ```

## 🖥️ Como Acessar

Após a conclusão do script:

- **Frontend**: `http://SEU_IP:5173`
- **Backend API**: `http://SEU_IP:3001`
- **Credenciais Padrão**: Consulte o administrador do sistema para o primeiro acesso.

## ⚙️ Configuração Pós-Instalação

- Os serviços são gerenciados via `systemd`:
  - `systemctl status fs-sas-frontend`
  - `systemctl status fs-sas-backend`
- Os arquivos do sistema ficam localizados em `/opt/filesystem-sas`.
- O diretório raiz dos arquivos do Samba é `/srv/samba`.

---
Desenvolvido para máxima performance e facilidade de uso em ambientes corporativos.
