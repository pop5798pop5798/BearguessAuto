//------------------------------------------------------------------------------
// <auto-generated>
//     這個程式碼是由範本產生。
//
//     對這個檔案進行手動變更可能導致您的應用程式產生未預期的行為。
//     如果重新產生程式碼，將會覆寫對這個檔案的手動變更。
// </auto-generated>
//------------------------------------------------------------------------------

namespace SITAPI.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class payout
    {
        public int sn { get; set; }
        public Nullable<int> betSn { get; set; }
        public Nullable<double> Odds { get; set; }
        public Nullable<double> money { get; set; }
        public Nullable<double> realMoney { get; set; }
        public Nullable<System.DateTime> createDate { get; set; }
        public Nullable<System.DateTime> modiDate { get; set; }
        public string comSn { get; set; }
        public Nullable<int> gameSn { get; set; }
        public Nullable<int> topicSn { get; set; }
        public Nullable<int> userSn { get; set; }
        public Nullable<int> unitSn { get; set; }
        public Nullable<int> choiceSn { get; set; }
        public Nullable<double> topicTotalMoney { get; set; }
        public Nullable<double> correctTotalMoney { get; set; }
        public Nullable<byte> isTrue { get; set; }
        public Nullable<double> rake { get; set; }
    }
}
