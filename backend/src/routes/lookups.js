const express = require('express');
const { sequelize } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all sites (tblsitename)
router.get('/sites', [authenticateToken], async (req, res, next) => {
  try {
    const sites = await sequelize.query(`
      SELECT SiteCode as code, NameEn as name 
      FROM tblsitename 
      ORDER BY SiteCode
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(sites);
  } catch (error) {
    next(error);
  }
});

// Get all VCCT sites (tblvcctsite)
router.get('/vcct-sites', [authenticateToken], async (req, res, next) => {
  try {
    const vcctSites = await sequelize.query(`
      SELECT Vid as code, SiteName as name 
      FROM tblvcctsite 
      WHERE Status = '1' 
      ORDER BY Vid
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(vcctSites);
  } catch (error) {
    next(error);
  }
});

// Get all drugs (tbldrug)
router.get('/drugs', [authenticateToken], async (req, res, next) => {
  try {
    const drugs = await sequelize.query(`
      SELECT Did as id, DrugName as name, Status
      FROM tbldrug 
      ORDER BY DrugName
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(drugs);
  } catch (error) {
    next(error);
  }
});

// Get all clinics (tblclinic)
router.get('/clinics', [authenticateToken], async (req, res, next) => {
  try {
    const clinics = await sequelize.query(`
      SELECT Cid as id, ClinicName as name
      FROM tblclinic 
      ORDER BY ClinicName
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(clinics);
  } catch (error) {
    next(error);
  }
});

// Get all reasons (tblreason)
router.get('/reasons', [authenticateToken], async (req, res, next) => {
  try {
    const reasons = await sequelize.query(`
      SELECT Rid as id, Reason as name
      FROM tblreason 
      ORDER BY Reason
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(reasons);
  } catch (error) {
    next(error);
  }
});

// Get all allergies (tblallergy)
router.get('/allergies', [authenticateToken], async (req, res, next) => {
  try {
    const allergies = await sequelize.query(`
      SELECT Aid as id, AllergyStatus as name, Type as status
      FROM tblallergy 
      ORDER BY Type, AllergyStatus
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(allergies);
  } catch (error) {
    next(error);
  }
});

// Get all drug treatments (tbldrugtreat)
router.get('/drug-treatments', [authenticateToken], async (req, res, next) => {
  try {
    const drugTreatments = await sequelize.query(`
      SELECT Tid as id, DrugName as name
      FROM tbldrugtreat 
      ORDER BY DrugName
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(drugTreatments);
  } catch (error) {
    next(error);
  }
});

// Get all nationalities (tblnationality)
router.get('/nationalities', [authenticateToken], async (req, res, next) => {
  try {
    const nationalities = await sequelize.query(`
      SELECT nid as id, nationality as name
      FROM tblnationality 
      ORDER BY nationality ASC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(nationalities);
  } catch (error) {
    next(error);
  }
});

// Get all target groups (tbltargroup)
router.get('/target-groups', [authenticateToken], async (req, res, next) => {
  try {
    const targetGroups = await sequelize.query(`
      SELECT Tid as id, Targroup as name
      FROM tbltargroup 
      WHERE Status = '1' 
      ORDER BY Tid
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(targetGroups);
  } catch (error) {
    next(error);
  }
});

// Get provinces (tblprovince)
router.get('/provinces', [authenticateToken], async (req, res, next) => {
  try {
    const provinces = await sequelize.query(`
      SELECT pid as id, provinceeng as name
      FROM tblprovince 
      ORDER BY pid
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(provinces);
  } catch (error) {
    next(error);
  }
});

// Get districts by province
router.get('/districts/:provinceId', [authenticateToken], async (req, res, next) => {
  try {
    const { provinceId } = req.params;
    
    const districts = await sequelize.query(`
      SELECT d.did as id, d.districteng as name
      FROM tbldistrict d
      INNER JOIN tblprovince p ON p.pid = d.pid
      WHERE p.pid = :provinceId
      ORDER BY d.did
    `, {
      replacements: { provinceId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(districts);
  } catch (error) {
    next(error);
  }
});

// Get communes by district
router.get('/communes/:districtId', [authenticateToken], async (req, res, next) => {
  try {
    const { districtId } = req.params;
    
    const communes = await sequelize.query(`
      SELECT c.cid as id, c.communeen as name
      FROM tblcommune c
      INNER JOIN tbldistrict d ON d.did = c.did
      WHERE d.did = :districtId
      ORDER BY c.cid
    `, {
      replacements: { districtId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(communes);
  } catch (error) {
    next(error);
  }
});

// Get villages by commune
router.get('/villages/:communeId', [authenticateToken], async (req, res, next) => {
  try {
    const { communeId } = req.params;
    
    const villages = await sequelize.query(`
      SELECT v.vid as id, v.villageen as name
      FROM tblvillage v
      INNER JOIN tblcommune c ON c.cid = v.cid
      WHERE c.cid = :communeId
      ORDER BY v.vid
    `, {
      replacements: { communeId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(villages);
  } catch (error) {
    next(error);
  }
});

// Get all hospitals (from tbleimain HospitalName field)
router.get('/hospitals', [authenticateToken], async (req, res, next) => {
  try {
    const hospitals = await sequelize.query(`
      SELECT DISTINCT HospitalName as name, HospitalName as code
      FROM tbleimain 
      WHERE HospitalName IS NOT NULL AND HospitalName != ''
      ORDER BY HospitalName
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(hospitals);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
