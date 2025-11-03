FROM ubuntu
LABEL maintainer="sarah@sudo.com"
RUN apt -y update
RUN apt -y install nginx
RUN apt -y install iputils-ping
COPY ./html /var/www/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
