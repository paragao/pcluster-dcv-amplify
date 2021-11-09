# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.194.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 16, 14, 12
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT} AS baseos

# Install AWS Amplify && install Amazon Corretto for mocking environments locally
RUN su node -c "npm install -g @aws-amplify/cli" 
RUN wget -O- https://apt.corretto.aws/corretto.key | sudo apt-key add - \
    && echo 'deb https://apt.corretto.aws stable main' >>/etc/apt/sources.list.d/corretto.list \
    && sudo apt update -y \
    && sudo apt install -y java-11-amazon-corretto-jdk 
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \ 
    && sudo ./aws/install 

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"