//------------------------------------------------------------------------------
// <auto-generated>
//     這個程式碼是由範本產生。
//
//     對這個檔案進行手動變更可能導致您的應用程式產生未預期的行為。
//     如果重新產生程式碼，將會覆寫對這個檔案的手動變更。
// </auto-generated>
//------------------------------------------------------------------------------

namespace SITW.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Problem
    {
        public int id { get; set; }
        public string title { get; set; }
        public string comment { get; set; }
        public string image_1 { get; set; }
        public string image_2 { get; set; }
        public string image_3 { get; set; }
        public Nullable<System.DateTime> inpdate { get; set; }
        public Nullable<byte> valid { get; set; }
        public string userId { get; set; }
    }
}