type Method = 'get' | 'post';
type Url = string;
type Data = object | null; 

class RequestWithURL {
  private url: Url

  constructor(url: Url) {
    this.url = url;
  }

  setMethod(method: Method): RequestSend {
    return new RequestSend(this.url, method);
  }
}

interface RequestReady { 
  send(): void;
}

class RequestSend implements RequestReady {
  private method: Method
  private url: Url
  private data: Data = null

  constructor(url: Url, method: Method) {
    this.url = url;
    this.method = method;
  }

  setData(data: Data): this {
    this.data = data;
    return this; 
  }

  send(): void {
    console.log(
      `Sending ${this.method} request to ${this.url} with data:`,
      this.data
    );
  }
}

class RequestData {
  setURL(url: Url): RequestWithURL {
    return new RequestWithURL(
      url
    );
  } 
}

new RequestData()
  .setURL('/users')
  .setMethod('get')
  .setData({firstName: 'Anna'})
  .send()
