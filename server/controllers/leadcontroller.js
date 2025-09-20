import leads from "../modle/leads.js";

// CREATE Lead
export const createLead = async (req, res) => {
  try {
    const leadData = { ...req.body, userid: req.user.id }; // ✅ changed created_by → userid
    const newLead = await leads.create(leadData);
    res.status(201).json({ success: true, lead: newLead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET Leads with Pagination & Filters
export const getLeads = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      email,
      company,
      city,
      status,
      source,
      score,
      score_gt,
      score_lt,
      score_between,
      leadvalue,
      leadvalue_gt,
      leadvalue_lt,
      leadvalue_between,
      created_at,
      created_before,
      created_after,
      created_between,
      lastactivity,
      lastactivity_before,
      lastactivity_after,
      lastactivity_between,
      isqualified,
    } = req.query;

    page = parseInt(page);
    limit = Math.min(parseInt(limit), 100);

    const query = { userid: req.user.id }; // ✅ match schema

    // --- String filters ---
    if (email) query.email = { $regex: email, $options: "i" };
    if (company) query.company = { $regex: company, $options: "i" };
    if (city) query.city = { $regex: city, $options: "i" };

    // --- Enum filters ---
    if (status) query.status = Array.isArray(status) ? { $in: status } : status;
    if (source) query.source = Array.isArray(source) ? { $in: source } : source;

    // --- Number filters ---
    if (score) query.score = score;
    if (score_gt) query.score = { ...query.score, $gt: Number(score_gt) };
    if (score_lt) query.score = { ...query.score, $lt: Number(score_lt) };
    if (score_between) {
      const [min, max] = score_between.split(",").map(Number);
      query.score = { $gte: min, $lte: max };
    }

    if (leadvalue) query.leadvalue = leadvalue;
    if (leadvalue_gt) query.leadvalue = { ...query.leadvalue, $gt: Number(leadvalue_gt) };
    if (leadvalue_lt) query.leadvalue = { ...query.leadvalue, $lt: Number(leadvalue_lt) };
    if (leadvalue_between) {
      const [min, max] = leadvalue_between.split(",").map(Number);
      query.leadvalue = { $gte: min, $lte: max };
    }

    // --- Date filters ---
    if (created_at) query.created_at = new Date(created_at);
    if (created_before) query.created_at = { ...query.created_at, $lt: new Date(created_before) };
    if (created_after) query.created_at = { ...query.created_at, $gt: new Date(created_after) };
    if (created_between) {
      const [start, end] = created_between.split(",");
      query.created_at = { $gte: new Date(start), $lte: new Date(end) };
    }

    if (lastactivity) query.lastactivity = new Date(lastactivity);
    if (lastactivity_before) query.lastactivity = { ...query.lastactivity, $lt: new Date(lastactivity_before) };
    if (lastactivity_after) query.lastactivity = { ...query.lastactivity, $gt: new Date(lastactivity_after) };
    if (lastactivity_between) {
      const [start, end] = lastactivity_between.split(",");
      query.lastactivity = { $gte: new Date(start), $lte: new Date(end) };
    }

    // --- Boolean filters ---
    if (isqualified !== undefined) query.isqualified = isqualified === "true";

    // --- Fetch leads ---
    const total = await leads.countDocuments(query);
    const allLeads = await leads.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      data: allLeads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Single Lead
export const getLeadById = async (req, res) => {
  try {
    const lead = await leads.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    if (lead.userid.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(401).json({ success: false, message: "Unauthorized" });
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Lead
export const updateLead = async (req, res) => {
  try {
    const lead = await leads.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    if (lead.userid.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const updatedLead = await leads.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, lead: updatedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await leads.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    if (lead.userid.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(401).json({ success: false, message: "Unauthorized" });

    await lead.deleteOne();
    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
