---
title: "How to create a csv file in memory with golang"
date: "2020-10-14"
path: "/how-to-create-a-csv-file-in-memory-with-golang"
author: "Mecit Semerci"
excerpt: "How to create a csv file in memory with go for saving cloud storages"
tags: ["golang","csv","memory"]
---

Sometimes you need to create an automatic report (invoice, bill) in CSV format. In such cases, it would be appropriate to keep it on blob storage instead of the server(container) disk. Now let's see how we can do it using memory without saving to disk at all.

```go
package csvmanager

import (
	"bytes"
	"encoding/csv"
	"errors"
)

func WriteAll(records [][]string) ([]byte, error) {
	if records == nil || len(records) == 0 {
		return nil, errors.New("records cannot be nil or empty")
	}
	var buf bytes.Buffer
	csvWriter := csv.NewWriter(&buf)
	err := csvWriter.WriteAll(records)
	if err != nil {
		return nil, err
	}
	csvWriter.Flush()
	if err := csvWriter.Error(); err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

```

 Let's try it out.

```go
func main() {
	items := [][]string{
		{"1", "Book", "18"},
		{"2", "Pencil", "3"},
		{"3", "Rubber", "2"},
	}

	byteData, err := csvmanager.WriteAll(items)

	if err!=nil{
		log.Fatal(err)
	}
	println(string(byteData))
}
```

Output

```
1,Book,18
2,Pencil,3
3,Rubber,2

```

Afterward, you can save your csv file in AWS S3, Azure Blob Storage, or Google Cloud Storage, etc.  