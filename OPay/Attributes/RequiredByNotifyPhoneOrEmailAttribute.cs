﻿using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Ecpay.EInvoice.Integration.Enumeration;

namespace Ecpay.EInvoice.Integration.Attributes
{
    /// <summary>
    /// 依據通知類別檢查該欄位是否必填的類別。
    /// </summary>
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = true, Inherited = true)]
    public class RequiredByNotifyPhoneOrEmailAttribute : RequiredAttribute
    {
        /// <summary>
        /// 是否檢核通過。
        /// </summary>
        /// <param name="value">要檢核的物件類別。</param>
        /// <returns>驗證成功為 True 否則為 False。</returns>
        public override bool IsValid(object value)
        {
            PropertyDescriptorCollection pdcProperties = null;

            object[] oValues = (object[])value;

            object oPropertyName = oValues[0]; // 屬性的名稱。
            object oPropertyValue = oValues[1]; // 屬性的值。
            object oSourceComponent = oValues[2]; // 該屬性所屬物件。

            // 特殊驗證：當通知類別為S，手機號碼不可為空值。
            if (oPropertyName.Equals("Phone"))
            {
                object oNeedCheckedValue1 = null;
                object oNeedCheckedValue2 = null;
                pdcProperties = TypeDescriptor.GetProperties(oSourceComponent);

                oNeedCheckedValue1 = pdcProperties.Find("Notify", true).GetValue(oSourceComponent);
                oNeedCheckedValue2 = pdcProperties.Find("NotifyMail", true).GetValue(oSourceComponent);

                if (oNeedCheckedValue1.Equals(InvoiceNotifyEnum.SMS) || oNeedCheckedValue1.Equals(InvoiceNotifyEnum.ALL) || string.IsNullOrEmpty(Convert.ToString(oNeedCheckedValue2)))
                {
                    return base.IsValid(oPropertyValue);
                }
            }
            // 特殊驗證：當通知類別為E，電子郵件不可為空值。
            if (oPropertyName.Equals("NotifyMail"))
            {
                object oNeedCheckedValue1 = null;
                object oNeedCheckedValue2 = null;
                pdcProperties = TypeDescriptor.GetProperties(oSourceComponent);

                oNeedCheckedValue1 = pdcProperties.Find("Notify", true).GetValue(oSourceComponent);
                oNeedCheckedValue2 = pdcProperties.Find("Phone", true).GetValue(oSourceComponent);

                if (oNeedCheckedValue1.Equals(InvoiceNotifyEnum.Email) || oNeedCheckedValue1.Equals(InvoiceNotifyEnum.ALL) || string.IsNullOrEmpty(Convert.ToString(oNeedCheckedValue2)))
                {
                    return base.IsValid(oPropertyValue);
                }
            }

            return true;
        }
    }
}