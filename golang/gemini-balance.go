/**
 * CGO_ENABLED=0 GOOS=linux GOARCH=amd64 ~/Software/go/bin/go build main.go
 * ~/Software/go/bin/go run main.go -host localhost -port 3000 -path ~/Desktop/
 */
 /**
 server {
    listen       443 ssl;
    server_name  gemini-balance.dongpo.li;

    #填写证书文件名称
    ssl_certificate /etc/nginx/conf.d/cert/any.dongpo.li.crt;
    #填写证书私钥文件名称··
    ssl_certificate_key /etc/nginx/conf.d/cert/any.dongpo.li.key;

    ssl_session_timeout 5m;
    #表示使用的加密套件的类型
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    #表示使用的TLS协议的类型，您需要自行评估是否配置TLSv1.1协议。
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

    ssl_prefer_server_ciphers on;


    # auth_request    /api/v1.0/auth/access;
    location = /api/v1.0/auth/access {
        proxy_pass              http://localhost:8000/api/v1.0/auth/access;
        # proxy_ssl_server_name on;
        # proxy_ssl_name gemini-key-pool.dongpo-li.workers.dev;
        proxy_http_version      1.1;
        # proxy_set_header        X-Keys-File keys1.txt;
        proxy_set_header        Connection keep-alive;
        proxy_set_header        Content-Length "";
        proxy_read_timeout      3600;
    }

    location /v1beta/openai/ {
        auth_request    /api/v1.0/auth/access;
        auth_request_set $x_gemini_key $upstream_http_x_gemini_key;
        proxy_set_header Authorization "Bearer $x_gemini_key";
        proxy_pass https://generativelanguage.googleapis.com/v1beta/openai/;
        proxy_ssl_name generativelanguage.googleapis.com;
        proxy_ssl_server_name on;
        proxy_set_header Host generativelanguage.googleapis.com;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        chunked_transfer_encoding off;
        proxy_read_timeout 3600;
        proxy_buffering off;
        proxy_cache off;
        proxy_redirect off;
        proxy_hide_header Cache-Control;
    }

    location / {
        auth_request    /api/v1.0/auth/access;
        auth_request_set $x_gemini_key $upstream_http_x_gemini_key;
        proxy_set_header x-goog-api-key "$x_gemini_key";
        proxy_pass https://generativelanguage.googleapis.com;
        proxy_ssl_name generativelanguage.googleapis.com;
        proxy_ssl_server_name on;
        proxy_set_header Host generativelanguage.googleapis.com;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        chunked_transfer_encoding off;
        proxy_read_timeout 3600;
        proxy_buffering off;
        proxy_cache off;
        proxy_redirect off;
        proxy_hide_header Cache-Control;
    }

}
 */
package main

import (
	"flag"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strings"
    "sync"
)

var keys []string

var serverHost string
var serverPort int
var configPath string

var cachedKey map[string][]string
var cachedKeyLock sync.Mutex

func init() {
	cachedKey = make(map[string][]string)

	flag.StringVar(&serverHost, "host", "localhost", "host to listen on")
	flag.IntVar(&serverPort, "port", 8000, "port to listen on")
	flag.StringVar(&configPath, "path", "keys.txt", "file containing keys")
	flag.Parse()

    // configPath is not end with "/"
    if !strings.HasSuffix(configPath, "/") {
        configPath += "/"
    }

}

func index(w http.ResponseWriter, r *http.Request) {

    var configFile string
    file := r.Header["X-Keys-File"]
    if file != nil && len(file) > 0 {
        configFile = configPath + file[0]
    } else {
        configFile = configPath + "keys.txt"
    }

    keys := cachedKey[configFile]
    if keys == nil || len(keys) == 0 {
        cachedKeyLock.Lock()
        defer cachedKeyLock.Unlock()
        // Read keys from the specified file
        if _, exists := cachedKey[configFile]; exists {
            keys = cachedKey[configFile]
        } else {
            content, err := os.ReadFile(configFile)
            if err != nil {
                fmt.Println("Error reading file:", err)
                return
            }
            keys = strings.Split(string(content), "\n")
            cachedKey[configFile] = keys
        }

    }

	w.Header().Set("Content-Type", "text/plain; charset=utf-8")

	idx := rand.Intn(len(keys))
	key := keys[idx]

	w.Header().Set("X-Gemini-Key", key)





	w.Write([]byte(key))
}

func main() {

	http.HandleFunc("/api/v1.0/auth/access", index)
	http.ListenAndServe(fmt.Sprintf("%s:%d", serverHost, serverPort), nil)
}