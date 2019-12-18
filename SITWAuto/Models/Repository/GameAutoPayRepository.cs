﻿using Dapper;
using SITDto;
using SITW.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using Microsoft.AspNet.Identity;
using SITDto.Request;
using SITW.Helper;
using System.Runtime.Caching;

namespace SITW.Models.Repository
{
    public class GameAutoPayRepository
    {

        private sitwEntities Db = new sitwEntities();

        

        public List<GamePosts> getCsgoList()
        {
            return Db.GamePosts.Where(x=>x.AutoSn != null && x.edate < DateTime.Now && x.pay != 1).ToList();
          
        }

        public List<GamePosts> getCsgoNoTimeList()
        {
            return Db.GamePosts.Where(x => x.AutoSn != null && x.edate > DateTime.Now && x.pay == null).ToList();

        }




        public Teams getImg(string teamname)
        {
            return Db.Teams.Where(x=> x.name == teamname).FirstOrDefault();
        }

        public List<Teams> getAllValid()
        {
            return Db.Teams.Where(p => p.valid == 1).ToList();
        }
        public void Create(Teams instance)
        {
            if (instance == null)
            {
                throw new ArgumentNullException("instance");
            }
            else
            {
                Db.Teams.Add(instance);
                this.SaveChanges();
                
            }
        }

        public int AutoCreate(Teams instance)
        {
            if (instance == null)
            {
                throw new ArgumentNullException("instance");
            }
            else
            {
                Db.Teams.Add(instance);
                this.SaveChanges();               

            }
            return instance.sn;
        }
        public void Update(Teams instance)
        {
            if (instance == null)
            {
                throw new ArgumentNullException("instance");
            }
            else
            {
                Db.Entry(instance).State = EntityState.Modified;
                this.SaveChanges();
            }
        }

        public void Delete(Teams instance)
        {
            if (instance == null)
            {
                throw new ArgumentNullException("instance");
            }
            else
            {
                Db.Entry(instance).State = EntityState.Deleted;
                this.SaveChanges();
            }
        }

        public void DeleteTeams(int leagueSn)
        {
            if (leagueSn == null)
            {
                throw new ArgumentNullException("instance");
            }
            else
            {
                List<Teams> instance = Db.Teams.Where(x => x.leagueSn == leagueSn).ToList();
                foreach(var t in instance)
                {
                    Db.Entry(t).State = EntityState.Deleted;
                    this.SaveChanges();
                }
                
            }
        }

        public Teams Get(int teamsID)
        {
            return Db.Teams.FirstOrDefault(x => x.sn == teamsID);
        }
        public Teams AddTeams(Teams teams)
        {
            Db.Teams.Add(teams);
            Db.SaveChanges();
            return teams;
        }

        public Teams UpdateTeams(Teams teams)
        {
            Db.Entry(teams).State = EntityState.Modified;
            Db.SaveChanges();
            return teams;
        }

        public void SaveChanges()
        {
            this.Db.SaveChanges();
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (this.Db != null)
                {
                    this.Db.Dispose();
                    this.Db = null;
                }
            }
        }

    }
}