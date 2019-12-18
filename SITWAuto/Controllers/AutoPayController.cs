using SITW.Filter;
using SITW.Models.Repository;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Net.Mime;
using System.Web.Routing;
using System.Xml;
using System.Xml.Linq;
using System.Net;
using System.IO;
using System.Net.Http;
using System.Text;
using Microsoft.AspNet.Identity;
using HtmlAgilityPack;
using SITW.Models;
using System.Runtime.Caching;
using Microsoft.AspNet.Identity.Owin;
using SITW.Models.ViewModel;
using SITDto.Request;
using SITW.Helper;
using SITW.Models.GameAPIModels;
using SITDto;
using Newtonsoft.Json;
using System.Collections.Specialized;
using SIT.Controllers;

namespace SITW.Controllers
{

    public class AutoPayController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        //HttpClient client;
        string encryptedKey;
        private static MemoryCache _cache = MemoryCache.Default;
        List<gameDto> gList;

        public AutoPayController()
        {
            encryptedKey = System.Web.Configuration.WebConfigurationManager.AppSettings["encryptedKey"];
            if (_cache.Contains("GameList"))
                gList = _cache.Get("GameList") as List<gameDto>;
            //client = new HttpClient();
            //client.BaseAddress = new Uri(System.Web.Configuration.WebConfigurationManager.AppSettings["apiurl"]);
            //client.DefaultRequestHeaders.Accept.Clear();
            //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public AutoPayController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

       public async System.Threading.Tasks.Task<ActionResult> SetPay()
        {
            var csgo = new GameAutoPayRepository().getCsgoList();



            foreach (var c in csgo)
            {
                try
                {
                    //var game = await new GamesRepository().GetGameDetail(c.GameSn);
                    CSGOMatches.RootObject getm = await new CSGORepository().GetCSGOMatches((int)c.AutoSn);
                    var gbat = (DateTime)getm.begin_at;

                    /*if (getm.end_at == null)
                    {
                        if (gbat.AddHours(3) < DateTime.Now)
                            await updateTimeAsync(c);

                        continue;
                    }*/


                    var game = await new GamesRepository().GetALLAutoGameList();
                    var g = game.Where(p => p.sn == c.GameSn).FirstOrDefault();

                    if (g.gameStatus == 4 || g.gameStatus == 3)
                        continue;

                    var allgame = new List<CSGOGame.RootObject>();
                    foreach (var m in getm.games)
                    {

                        CSGOGame.RootObject getg = await new CSGORepository().GetCSGOGame(m.id);
                        allgame.Add(getg);
                    }
                    if (getm.number_of_games > 2)
                    {
                        if (allgame[0].rounds.Count() == 0 || allgame[1].rounds.Count() == 0 || allgame.Count() == 0 || getm.winner.name == null)
                            continue;
                    }
                    else if (getm.number_of_games == 1)
                    {
                        if (allgame[0].rounds.Count() == 0 || getm.winner.name == null || allgame.Count() == 0)
                            continue;

                    }
                    else if (getm.number_of_games == 2)
                    {
                        if (allgame[0].rounds.Count() == 0 || allgame[1].rounds.Count() == 0 || allgame.Count() == 0)
                            continue;

                    }



                    await CSGOSetAnswer(c.sn, allgame, getm);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }
            }

                return View();
        }

        public async System.Threading.Tasks.Task<ActionResult> AutoPayTest()
        {

            var csgo = new GameAutoPayRepository().getCsgoList();

            foreach (var c in csgo)
            {
                CSGOMatches.RootObject getm = await new CSGORepository().GetCSGOMatches((int)c.AutoSn);
                var gt = (DateTime)getm.end_at;
                if (getm.end_at == null && gt.AddMinutes(10) > DateTime.Now)
                    continue;

                var game = await new GamesRepository().GetALLAutoGameList();
                //var game = await new GamesRepository().GetGameDetail(c.GameSn);
                var g = game.Where(p => p.sn == c.GameSn).FirstOrDefault();
                if (g.gameStatus != 4)
                    continue;

                await new AutoPayController().pays(c.GameSn);
                try
                {
                    //發送至gti
                    string url = "http://funbet.games/Account/BearAutoPayLoginByURL";
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                    request.Method = "POST";
                    request.ContentType = "application/x-www-form-urlencoded";
                    string result = null;


                    string param = "par=vnTy73o73S6DInB9blni0jLxdfSZO%2BxbU9/dyY4VcUr9rCNcS9ErKMzWjixZlA6CPATa9f8aKtLqASTHeb7xKnoqPOrCD34odGD2w1jmr2NaMycREjIlJe0bUdfD8qcx&bearid=" + c.sn.ToString();
                    byte[] bs = Encoding.ASCII.GetBytes(param);

                    using (Stream reqStream = request.GetRequestStream())
                    {
                        reqStream.Write(bs, 0, bs.Length);
                    }

                    using (WebResponse response = request.GetResponse())
                    {
                        StreamReader sr = new StreamReader(response.GetResponseStream());
                        result = sr.ReadToEnd();
                        sr.Close();
                    }
                }
                catch
                {

                }




            }

            return View();
        }

        public async System.Threading.Tasks.Task<ActionResult> GTIPOST()
        {
            var csgo = new GameAutoPayRepository().getCsgoList();

            foreach (var c in csgo)
            {
                try
                {
                    CSGOMatches.RootObject getm = await new CSGORepository().GetCSGOMatches((int)c.AutoSn);
                    var gt = (DateTime)getm.end_at;
                    if (getm.end_at == null && gt.AddMinutes(10) > DateTime.Now)
                        continue;
                    var game = await new GamesRepository().GetALLAutoGameList();
                    //var game = await new GamesRepository().GetGameDetail(c.GameSn);
                    var g = game.Where(p => p.sn == c.GameSn).FirstOrDefault();
                    if (g.gameStatus == 4 || g.gameStatus == 1 || g.gameStatus == 2 || g.gameStatus == 0)
                        continue;


                    //發送至gti
                    string url = "http://funbet.games/Account/BearAutoPayLoginByURL";
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                    request.Method = "POST";
                    request.ContentType = "application/x-www-form-urlencoded";
                    string result = null;


                    string param = "par=vnTy73o73S6DInB9blni0jLxdfSZO%2BxbU9/dyY4VcUr9rCNcS9ErKMzWjixZlA6CPATa9f8aKtLqASTHeb7xKnoqPOrCD34odGD2w1jmr2NaMycREjIlJe0bUdfD8qcx&bearid=" + c.sn.ToString();
                    byte[] bs = Encoding.ASCII.GetBytes(param);

                    using (Stream reqStream = request.GetRequestStream())
                    {
                        reqStream.Write(bs, 0, bs.Length);
                    }

                    using (WebResponse response = request.GetResponse())
                    {
                        StreamReader sr = new StreamReader(response.GetResponseStream());
                        result = sr.ReadToEnd();
                        sr.Close();
                    }
                }
                catch
                {

                }
            }

            return View();


        }

        public async System.Threading.Tasks.Task<ActionResult> TimeUpdate()
        {
            var csgo = new GameAutoPayRepository().getCsgoNoTimeList();



            foreach (var c in csgo)
            {
                try
                {
                    //var game = await new GamesRepository().GetGameDetail(c.GameSn);
                    CSGOMatches.RootObject getm = await new CSGORepository().GetCSGOMatches((int)c.AutoSn);


                    //更新時間日期
                    var gpm = await new gameController().AutoEdit(c.sn);

                    if (gpm.gamepost.edate != getm.begin_at)
                    {
                        gpm.gamepost.edate = getm.begin_at;
                        gpm.game.edate = getm.begin_at;
                        gpm.game.gamedate = getm.begin_at;
                        foreach (var t in gpm.game.topicList)
                        {
                            t.edate = getm.begin_at;
                        }
                        await new gameController().AutoEdit(gpm);

                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }




            }

            return View();


        }




        public async System.Threading.Tasks.Task<string> CSGOSetAnswer(int gpid, List<CSGOGame.RootObject> cslist, CSGOMatches.RootObject csgetm)
        {
            try
            {
                GamePosts gamepost = new GamePostsRepository().get(gpid);
                gameDto game = null;
                game = await new GamesRepository().GetGameDetail(gamepost.GameSn);

                GamePostViewModel gpvm = new GamePostViewModel(gpid, encryptedKey, game);
                gpvm.gamepost = gamepost;

               // game = await new GamesRepository().GetGameDetail(gamepost.GameSn);


                gameDto gd = null;
                GamesRepository _games = new GamesRepository();
                gd = await _games.GetGameDetail(gpvm.game.sn);
                


                if (1 == 1)
                {
                    List<choiceDto> choice = new List<choiceDto>();
                    foreach (topicDto t in gpvm.game.topicList)
                    {
                        foreach(var c in t.choiceList)
                        {
                            //1:哪隊會獲得勝利 2:總地圖數奇/偶 3:第一個地圖勝利隊伍 4:第二個地圖勝利隊伍 5:總地圖數會高於還是低於x.5 6:第一個地圖總回合數奇/偶 7:第二個地圖總回合數奇/偶
                            switch (t.autotype)
                            {
                                case 1:
                                    if (csgetm.winner == null)
                                    {
                                        if(c.cNumberType == 3)
                                             c.isTrue = 1;
                                        else
                                            c.isTrue = 0;

                                    }
                                    else {
                                        if (csgetm.winner.name == c.choiceStr)
                                        {
                                            c.isTrue = 1;
                                        }
                                        else
                                        {
                                            c.isTrue = 0;
                                        }
                                    }

                                   
                                    break;
                                case 2:
                                    if (cslist.Count() % 2 == 0 && c.cNumberType == 1)
                                    {
                                        c.isTrue = 1;
                                    }
                                    else if (cslist.Count() % 2 != 0 && c.cNumberType == 0)
                                    {

                                        c.isTrue = 1;
                                    }
                                    else
                                    {
                                        c.isTrue = 0;
                                    }
                                    break;
                                case 3:
                                    CSGOTeam.RootObject wteam = await new CSGORepository().GetCSGOTeam((int)csgetm.games[0].winner.id);
                                    if (wteam.name == c.choiceStr)
                                    {
                                        c.isTrue = 1;
                                    }
                                    else
                                    {
                                        c.isTrue = 0;
                                    }
                                    break;
                                case 4:
                                    wteam = await new CSGORepository().GetCSGOTeam((int)csgetm.games[1].winner.id);
                                    if (wteam.name == c.choiceStr)
                                    {
                                        c.isTrue = 1;
                                    }
                                    else
                                    {
                                        c.isTrue = 0;
                                    }
                                    break;
                                case 5:
                                    if (cslist.Count() < t.numberType && c.cNumberType == 1)
                                    {
                                        c.isTrue = 1;
                                    }
                                    else if (cslist.Count() > t.numberType && c.cNumberType == 0)
                                    {
                                        c.isTrue = 1;
                                    }
                                    else
                                    {
                                        c.isTrue = 0;
                                    }
                                    break;
                                case 6:
                                    if (cslist[0].rounds.Count() % 2 == 0 && c.cNumberType == 1)
                                    {
                                        c.isTrue = 1;
                                    }
                                    else if (cslist[0].rounds.Count() % 2 != 0 && c.cNumberType == 0)
                                    {

                                        c.isTrue = 1;
                                    }
                                    else
                                    {
                                        c.isTrue = 0;
                                    }
                                    break;
                                case 7:
                                    if (cslist[1].rounds.Count() % 2 == 0 && c.cNumberType == 1)
                                    {
                                        c.isTrue = 1;
                                    }
                                    else if (cslist[1].rounds.Count() % 2 != 0 && c.cNumberType == 0)
                                    {

                                        c.isTrue = 1;
                                    }
                                    else
                                    {
                                        c.isTrue = 0;
                                    }
                                    break;
                                default:
                                    Console.WriteLine("error");
                                    break;




                            }


                        }

                        if (t.choiceList.Where(x => x.isTrue == 1).Count() == 0)
                        {
                            gpvm.game.gameStatus = 2;
                            gpvm.gamepost.pay = 5;
                            await new gameController().AutoEdit(gpvm);
                            rebearpage(gpvm.game.sn);
                            throw new Exception("error");
                        }                            
                        else
                        {
                            choice.AddRange(t.choiceList);
                        }
                            

                            
                        
                    }



                        
                    bool haveTrue = false;
                    bool allReturn = true;
                    foreach (choiceDto cho in choice)
                    {
                        if (cho.isTrue.HasValue && cho.isTrue == 1)
                            haveTrue = true;
                        if (cho.isTrue != 2)
                            allReturn = false;

                    }
                    if (haveTrue || allReturn)
                    {
                        SetWinnerReq swq = new SetWinnerReq();
                        swq.UserID = new AccountRepository().getUserEmail("pop5798pop5798@gmail.com").Id;
                        swq.comSn = 1;
                        swq.choiceList = choice;
                        swq.gameSn = gpvm.game.sn;
                        bool issuccess = await _games.setWinner(swq);
                        if (!issuccess)
                            return "系統設定出錯";
                        new SignalRHelper().UpdateTopic(gpvm.game, encryptedKey, gpvm.game.md5GameSn);

                        rebearpage(gpvm.game.sn);
                       

                    }
                    else
                    {
                        return "未設定設定結果";
                    }
                }
                // Return the URI of the created resource.


                return "1";
            }
            catch
            {
                return "0";
            }


        }




        /// <summary>
        /// 遊戲派彩
        /// </summary>
        /// <param name="id">遊戲id(GameSn)</param>
        /// <returns></returns>
        [HttpPost]
        public async System.Threading.Tasks.Task<string> pays(int id)
        {
            aJaxDto ajd = new aJaxDto();
            try
            {
                gameDto game = null;
                GamesRepository _games = new GamesRepository();
                game = await _games.GetGameDetail(id);
                if (1 == 1)
                {
                    List<payoutDto> payoutList = new List<payoutDto>();
                    StartBetReq sbr = new StartBetReq();
                    sbr.UserID = new AccountRepository().getUserEmail("pop5798pop5798@gmail.com").Id;
                    sbr.comSn = 1;
                    sbr.gameSn = id;
                    ajd = await _games.pays(sbr, game.betModel);
                    game = await _games.GetGameDetail(sbr.gameSn);
                    rebearpage(id);



                    new SignalRHelper().UpdateTopic(game, encryptedKey, game.md5GameSn);

                    
                }
  
            }
            catch
            {
                ajd.isTrue = false;
                ajd.ErrorCode = 500;
            }
           
            return JsonConvert.SerializeObject(ajd);

        }

        public void rebearpage(int sn) {
            try
            {
                //重整熊i猜
                string url = "https://funbet.com.tw/game/PostUpdateGameAsync";
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                NameValueCollection postParams = System.Web.HttpUtility.ParseQueryString(string.Empty);
                postParams.Add("id", sn.ToString());
                byte[] byteArray = Encoding.UTF8.GetBytes(postParams.ToString());
                using (Stream reqStream = request.GetRequestStream())
                {
                    reqStream.Write(byteArray, 0, byteArray.Length);
                }
                var response = (HttpWebResponse)request.GetResponse();

            }
            catch {


            }
           


        }






    }
}