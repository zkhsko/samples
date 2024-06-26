package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	flag.Parse()
	args := flag.Args()
	if len(args) == 0 {
		log.Println("需要文件名")
		return
	}
	filename := args[0]
	hosts := read("hosts")

	if filename == "ls" {
		fmt.Println(string(hosts))
		return
	}
	switch filename {
	case "ls":
		fmt.Println(string(read("/etc/hosts")))
		return
	case "reset":
		err := ioutil.WriteFile("/etc/hosts", hosts, os.FileMode(644))
		if err != nil {
			log.Println(err)
		}
		return
	default:

	}

	custom := read(filename)

	enters := []byte("\n###########  " + filename + "  ###########\n")

	all := append(hosts, enters...)
	all = append(all, custom...)

	err := ioutil.WriteFile("/etc/hosts", all, os.FileMode(644))
	if err != nil {
		log.Println(err)
	}
}

func read(filename string) []byte {
	bs, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Println(err)
		return []byte{}
	}
	return bs
}
