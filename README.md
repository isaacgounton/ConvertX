# PixelFlow API Documentation

## HTTP Request Format

### Convert from URL

**Endpoint:** `POST http://localhost:3000/convert-url`

**Headers:**
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
```

**Form Fields:**
- `url`: URL of the image to convert
- `format`: Target format (webp, jpg, or png)

**Raw HTTP Request:**
```http
POST /convert-url HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="url"

https://example.com/image.jpg
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="format"

webp
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Implementation Examples:**

1. cURL:
```bash
curl -X POST \
     -F "url=https://example.com/image.jpg" \
     -F "format=webp" \
     "http://localhost:3000/convert-url" \
     --output output.webp
```

2. Python - requests:
```python
import requests

files = {
    'url': (None, 'https://example.com/image.jpg'),
    'format': (None, 'webp')
}

response = requests.post(
    'http://localhost:3000/convert-url',
    files=files
)

# Save the image
with open('output.webp', 'wb') as f:
    f.write(response.content)
```

3. PHP - cURL:
```php
<?php
$ch = curl_init();

$data = [
    'url' => 'https://example.com/image.jpg',
    'format' => 'webp'
];

curl_setopt($ch, CURLOPT_URL, 'http://localhost:3000/convert-url');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

// Save the image
file_put_contents('output.webp', $response);
?>
```

4. JavaScript - Fetch:
```javascript
const formData = new FormData();
formData.append('url', 'https://example.com/image.jpg');
formData.append('format', 'webp');

fetch('http://localhost:3000/convert-url', {
    method: 'POST',
    body: formData
})
.then(response => response.blob())
.then(blob => {
    // Save the image
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.webp';
    a.click();
});
```

5. Axios:
```javascript
const formData = new FormData();
formData.append('url', 'https://example.com/image.jpg');
formData.append('format', 'webp');

axios({
    method: 'post',
    url: 'http://localhost:3000/convert-url',
    data: formData,
    responseType: 'arraybuffer'
})
.then(response => {
    fs.writeFileSync('output.webp', response.data);
});
```

### Convert from File

**Endpoint:** `POST http://localhost:3000/convert?format=webp`

**Headers:**
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
```

**Query Parameters:**
- `format`: Target format (webp, jpg, or png)

**Form Fields:**
- `image`: The image file to convert

**Raw HTTP Request:**
```http
POST /convert?format=webp HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="input.jpg"
Content-Type: image/jpeg

[Binary file data here]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Implementation Examples:**

1. cURL:
```bash
curl -X POST \
     -F "image=@input.jpg" \
     "http://localhost:3000/convert?format=webp" \
     --output output.webp
```

2. Python - requests:
```python
import requests

files = {
    'image': open('input.jpg', 'rb')
}

response = requests.post(
    'http://localhost:3000/convert',
    params={'format': 'webp'},
    files=files
)

with open('output.webp', 'wb') as f:
    f.write(response.content)
```

### Response

The API returns the converted image directly in the response body with the appropriate Content-Type header:

```http
HTTP/1.1 200 OK
Content-Type: image/webp
Content-Length: 12345

[Binary image data]
```

The response is always the raw image data that you can:
1. Save directly to a file
2. Process as a binary buffer
3. Display in a browser
4. Stream to another service

### Error Response

When an error occurs, the API returns a JSON response:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
    "error": "Error message here"
}
```
