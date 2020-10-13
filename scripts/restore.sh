#! /bin/bash
set -e

compose_file_path=$1
project_name=$2
backup_file=$3
work_dir=`pwd`

#checking compose_file_path availability
if [ ! -f $compose_file_path ]; then
  echo "'$compose_file_path' not found"
  exit 1
fi

#checking backup_file availability
if [ ! -f $backup_file ]; then
  echo "'$backup_file' not found"
  exit 1
fi

# compatibility for win
if [[ "$(expr substr $(uname -s) 1 5)" == "MINGW" ]]; then
  work_dir=`pwd -W`
fi

echo "Extracting backup..."
tar -xf $backup_file

echo "Stopping running containers..."
volumes=($(docker volume ls -f name=$project_name | awk '{if (NR > 1) print $2}'))
docker-compose -f $compose_file_path --project-name $project_name down

echo "Mounting volumes and performing restore backup..."
for v in "${volumes[@]}"
do  
  docker volume rm $v > /dev/null
  docker volume create $v > /dev/null
  arc="$v".tar.bz2
  if [ -f "$v".tar.bz2 ]; then	
    docker run -v $v:/volume:rw -v $work_dir:/backup --rm loomchild/volume-backup restore $arc && echo "$v success"
    rm -f $arc	
  else
    echo "$v skipped"
  fi
done

echo "Restarting containers..."
docker-compose -f $compose_file_path --project-name $project_name up -d

echo "Backup ${backup_file} restored"
