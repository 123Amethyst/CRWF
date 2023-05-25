namespace CRDT.WF.Response
{
    public class ResponseData
    {
        public ResponseData()
        {
            Code = 200;
            Count = 0;
        }
        public short Code { get; set; }
        public string Message { get; set; }
        public dynamic Data { get; set; }
        public int Count { get; set; }
    }

    public class APIResponseData<T>
    {

        public short Code { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public int Count { get; set; }
    }
}