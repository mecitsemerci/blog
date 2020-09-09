---
title: "Golang json (Un)marshal custom date format"
date: "2020-08-24"
path: "/golang-json-unmarshal-custom-date-format"
author: "Mecit Semerci"
excerpt: "Golang json (un)marshal custom date formats"
---

If we want to create a RESTFul API, we may need a date type field. Especially you are doing an integration API, the date format may not always be what you want. JSON serialization on GO can be annoying sometimes. In such cases, you can follow a method like that.

```go
package customTypes

import (
	"errors"
	"fmt"
	"strings"
	"time"
)

type JSONTime time.Time

const DefaultFormat = time.RFC3339

var layouts = []string{
	DefaultFormat,
	"2006-01-02T15:04Z",        // ISO 8601 UTC
	"2006-01-02T15:04:05Z",     // ISO 8601 UTC
	"2006-01-02T15:04:05.000Z", // ISO 8601 UTC
	"2006-01-02T15:04:05",      // ISO 8601 UTC
	"2006-01-02 15:04",         // Custom UTC
	"2006-01-02 15:04:05",      // Custom UTC
	"2006-01-02 15:04:05.000",  // Custom UTC
}

// JSONTime
func (jt *JSONTime) String() string {
	t := time.Time(*jt)
	return t.Format(DefaultFormat)
}

func (jt JSONTime) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf(`"%s"`,jt.String())), nil
}

func (jt *JSONTime) UnmarshalJSON(b []byte) error {
	timeString := strings.Trim(string(b), `"`)
	for _, layout := range layouts {
		t, err := time.Parse(layout, timeString)
		if err == nil {
			*jt = JSONTime(t)
			return nil
		}
	}
	return errors.New(fmt.Sprintf("Invalid date format: %s", timeString))
}

func (jt *JSONTime) ToTime() time.Time {
	return time.Time(*jt)
}
```

Here, I'm using the RFC3339 format as default.

 Let's try it out.

```go
func main() {
	jsonValue := []byte(`{"dates":[	"2020-10-29T15:04:34",
                                   	"2020-10-29T15:04:34Z",
									"2020-10-29T15:04:34.344Z",
									"2020-09-01T00:00Z",
									"2020-10-29 15:04",
                                   	"2020-10-29 15:04:34",
									"2020-10-29 15:04:34.344"
	]}`)

	var model map[string][]customTypes.JSONTime

	err := json.Unmarshal(jsonValue, &model)

	if err != nil {
		fmt.Println(err.Error())
	}

	for index, date := range model["dates"] {
		loc, _ := time.LoadLocation("Turkey")
		fmt.Println([]string{strconv.Itoa(index), date.String(), date.ToTime().In(loc).String()})
	}
}
```

Output

```
| INDEX |         DATE         |            DATE(LOCAL)            |
|-------|----------------------|-----------------------------------|
|     0 | 2020-10-29T15:04:34Z | 2020-10-29 18:04:34 +0300 +03     |
|     1 | 2020-10-29T15:04:34Z | 2020-10-29 18:04:34 +0300 +03     |
|     2 | 2020-10-29T15:04:34Z | 2020-10-29 18:04:34.344 +0300 +03 |
|     3 | 2020-09-01T00:00:00Z | 2020-09-01 03:00:00 +0300 +03     |
|     4 | 2020-10-29T15:04:00Z | 2020-10-29 18:04:00 +0300 +03     |
|     5 | 2020-10-29T15:04:34Z | 2020-10-29 18:04:34 +0300 +03     |
|     6 | 2020-10-29T15:04:34Z | 2020-10-29 18:04:34.344 +0300 +03 |

```

If you want to get "ms" values for convert to String, use RFC3339Nano instead of RFC3339 for DefaultFormat. I usually use dates in UTC, If I need to use its local time, it will be more advantageous to change later.

Now let's try Marshal time.Time variable

```go
func main() {

	date := time.Date(2020, 9, 9, 13, 34, 17, 0, time.UTC)
	jt := customTypes.JSONTime(date)

	byteValue, err := json.Marshal(jt)
	if err != nil {
		fmt.Println(err.Error())
	}

	fmt.Println(string(byteValue))
}
```

Output

```
"2020-09-09T13:34:17Z"
```

[Gist Link](https://gist.github.com/mecitsemerci/6517ae38a4355ad44bf695d89c76a242)