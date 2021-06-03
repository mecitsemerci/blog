---
title: "How to check for an empty object in Go"
date: "2021-06-03"
path: "/how-to-check-for-an-empty-object-in-go"
author: "Mecit Semerci"
excerpt: "How to check for an empty object in Go"
tags: ["golang","check","struct","array","slice","map"]
---

I usually check some items (struct, array, slice, map, pointer etc.) but I don't like using too many if blocks for object checking. So I created a check helper package for object checking. Go reflection package helped a lot with this.

```go
package check

import (
	"reflect"
)

func IsEmpty(obj interface{}) bool {
	
	if obj == nil {
		return true
	}

	objValue := reflect.ValueOf(obj)

	switch objValue.Kind() {
	case reflect.Array, reflect.Chan, reflect.Map, reflect.Slice:
		return objValue.Len() == 0
	case reflect.Ptr:
		if objValue.IsNil() {
			return true
		}
		ref := objValue.Elem().Interface()
		return IsEmpty(ref)
	default:
		zero := reflect.Zero(objValue.Type())
		return reflect.DeepEqual(obj, zero.Interface())
	}
}

func IsEmptyOrWhiteSpace(str string) bool {
	if IsEmpty(str) || len(strings.TrimSpace(str)) == 0 {
		return true
	}
	return false
}

```

I got inspired from https://github.com/stretchr/testify