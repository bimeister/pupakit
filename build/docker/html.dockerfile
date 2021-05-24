FROM pupakit_docs_service as files_site
FROM nginx
COPY --from=files_site /base/dist/demo /usr/share/nginx/html