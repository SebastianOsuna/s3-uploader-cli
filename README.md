```
npm install -g s3-uploader-cli
```

```
s3uploader -b my_bucket -r us-east-1 -d /var/log -i ".*.log.+" -k mykey -s mysecret --clean
```

## Options

`-b`, `bucket`: Bucket for files to be uploaded.

`-r`, `region`: Bucket's region.

`-d`, `directory`: Root directory. The RegExp provided by `-i` only makes a shallow match of this directory.

`-i`, `input`: JS Regexp to filter files to be uploaded. Use `"`.

`-k`, `key`: AWS key.

`-s`, `secret`: AWS secret.

`--clean` **optional**: Delete original files after being uploaded.

## Notes

Files are uploaded to `my_bucket/<hostname>/<filename>`. Where `<hostname>` is provided by `os.hostname()`.
