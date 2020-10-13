#! /bin/bash
set -e

compose_file_path=$1
project_name=$2
arch_name="backup_$(date +"%d_%m_%Y").tar"
work_dir=`pwd`

#checking compose_file_path availability
if [ ! -f $compose_file_path ]; then
  echo "'$compose_file_path' not found"
  exit 1
fi

# compatibility for win
if [[ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]]; then
  work_dir=`pwd -W`
fi

rm -f $arch_name
echo "Stopping running containers..."
docker-compose -f $compose_file_path --project-name $project_name stop

echo "Mounting volumes and performing backup..."
volumes=($(docker volume ls -f name=$project_name | awk '{if (NR > 1) print $2}'))
for v in "${volumes[@]}"
do
  arc="$v".*.bz2
  if [[ $(docker run -v $v:/volume:ro -v $work_dir:/backup --rm --entrypoint sh loomchild/volume-backup -c 'ls -A /volume') ]]; then
    docker run -v $v:/volume:ro -v $work_dir:/backup --rm loomchild/volume-backup backup $v && echo "$v success"
    tar --append --file=$arch_name $arc
    rm -f $arc
  else
    echo "$v skipped"
  fi
done

echo "Restarting containers..."
docker-compose -f $compose_file_path --project-name $project_name start

echo "Backup ready: ${arch_name}"
