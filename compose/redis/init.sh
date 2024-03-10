echo "Starting redis server..."
#WARNING: Host must add " vm.overcommit_memory=1" to /etc/sysctl.conf, not the container!
redis-server /usr/local/etc/redis/redis.conf --bind 0.0.0.0 