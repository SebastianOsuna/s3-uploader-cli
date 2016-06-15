var bucket, region, input, dir, clean, key, secret;
var i, j, k, l, m, n;
var s3 = require('s3');
var fs = require('fs');
var path = require('path');
var async = require('async');
var os = require('os');

if ((i = process.argv.indexOf('-b')) === -1) {
  return console.log("Must provide a bucket");
}
bucket = process.argv[i + 1];

if ((j = process.argv.indexOf('-r')) === -1) {
  return console.log("Must provide a region");
}
region = process.argv[j + 1];

if ((k = process.argv.indexOf('-i')) === -1) {
  return console.log("Must provide an input");
}
input = process.argv[k + 1];

if ((l = process.argv.indexOf('-d')) === -1) {
  return console.log("Must provide a directory");
}
dir = process.argv[l + 1];

if ((m = process.argv.indexOf('-k')) !== -1) {
  key = process.argv[m + 1];
}

if ((n = process.argv.indexOf('-s')) !== -1) {
  secret = process.argv[n + 1];
}

clean = process.argv.indexOf('--clean') > -1;

s3.AWS.config.region = region;

fs.readdir(dir, function (err, files) {
  if (err) {
    throw err;
  }
  var r = new RegExp(input);
  var uploadingFiles = files.filter(function (f) {
    return r.exec(f);
  });
  console.log('%s files to be uploaded.', uploadingFiles.length);

  uploadFiles(dir, uploadingFiles);
});

function uploadFiles(dir, uploadFiles) {
  var opts = {};
  if (key && secret) {
    opts.accessKeyId = key;
    opts.secretAccessKey = secret;
  }
  var client = s3.createClient({
    s3Options: opts
  });
  async.each(uploadFiles, function (file, callback) {
    var origin = path.join(dir, file);
    var params = {
      localFile: origin,
      s3Params: {
        Bucket: bucket,
        Key: os.hostname() + '/' + file
      }
    };
    var uploader = client.uploadFile(params);
    uploader.on('error', function (err) {
      callback(err);
    });
    uploader.on('progress', function() {
      console.log('uploading progress: %s', origin, uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      if (clean) {
        fs.unlink(origin, function (err) {
          callback(err, origin);
        });
      } else {
        callback(null, origin);
      }
    });
  }, function (err, files) {
    if (err) {
      throw err
    }
  });

}
