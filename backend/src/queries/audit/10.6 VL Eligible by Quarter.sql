set @datestart="2022-07-01";
set @datestop="2022-09-30";
select * from
(select a.ClinicID, a.ART, a.DaArt, lvl.Dat,  lvl.HIVLoad,
if( lvl.hivload is null and timestampdiff(month,a.daart,@datestop)>=5,"DO VL",
if(lvl.hivload>=40 and timestampdiff(month,lvl.Dat,@datestop)>4 ,"DO VL",
if(lvl.hivload<40 and timestampdiff(month,lvl.Dat,@datestop)>=10 ,"DO VL",
if(lvl.hivload<40 and timestampdiff(month,a.DaART,lvl.Dat)>=5 and timestampdiff(month,a.DaART,lvl.Dat)<=7 and timestampdiff(month,lvl.Dat ,@datestop)>=5 and timestampdiff(month,lvl.Dat ,@datestop)<=7  ,"DO VL",
""))))  as StatusVL ,Concat(timestampdiff(month,if(lvl.dat is null,a.DaART,lvl.Dat),@datestop), " months") as VLPeroid,ip.Dat as Dateinquarter,  ip.HIVLoad as HIVloadinQuater from  (select distinctrow * from tblaart union select distinctrow * from tblcart) a

left join 
 (select distinctrow * from tblavpatientstatus where Da<=@datestart 
 union
 select distinctrow * from tblcvpatientstatus where Da<=@datestart 
 ) ps on ps.clinicid=a.clinicid
 
left join
(select distinct p.ClinicID, p.Dat, p.DaCollect, p.HIVLoad, p.HIVLog from tblpatienttest p
inner join
(select pt.ClinicID,max(pt.dat) as dat from
(select cast(ClinicID as signed) as clinicid, Dat, DaCollect, HIVLoad,HIVLog from tblpatienttest
where hivload<>''  and Dat<@datestart and clinicid not like 'P%'
union
select ClinicID, Dat, DaCollect, HIVLoad,HIVLog from tblpatienttest
where hivload<>''  and Dat<@datestart and clinicid like 'P%'
) pt
group by pt.clinicid ) mp on mp.clinicid=p.clinicid and mp.dat=p.dat) lvl on lvl.clinicid=a.ClinicID

left join
(select distinct p.ClinicID, p.Dat, p.DaCollect, p.HIVLoad, p.HIVLog from tblpatienttest p
 inner join
 (select ClinicID, max(Dat) as Dat from tblpatienttest 
 where hivload<>''  and Dat>=@datestart and Dat<=@datestop
 group by ClinicID
 ) md on md.clinicid=p.clinicid and md.dat=p.dat) ip on ip.clinicid=a.ClinicID
where ps.da is null ) l
 where l.StatusVL<>''
 order by l.clinicid


