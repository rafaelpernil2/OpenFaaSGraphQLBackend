async function handle(event: any, context: any, cb: any) {
  const result = {
    'body': "AAAAAAAAAAAAAA" + JSON.stringify(event.body),
    'content-type': event.headers["content-type"]
  }
  return context
    .status(200)
    .succeed(result)
}

export = handle;
