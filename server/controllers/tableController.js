const Cell = require("../models/Cell");
const Week = require("../models/Week");
const pdf = require('html-pdf');

const createTable = async () => {
  try {
    const week = await Week.findOne({ week: Week.getWeek() });
    if (!week) {
      await new Week().save();
    }
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        try {
          const newCell = new Cell({
            title: "Çözülmedi",
            day: i,
            lesson: j,
            exerciseStats: {
              total: 0,
              correct: 0,
              wrong: 0,
              empty: 0,
            },
          });
          await newCell.save();

          const week = await Week.findOne({ week: Cell.getWeek() });
          week.cells.push(newCell._id);
          await week.save();
        } catch (error) {}
      }
    }
    return;
  } catch (error) {
    return error;
  }
};

const getWeek = async (req, res) => {
  try {
    const week = await Week.findOne({ week: Week.getWeek() });
    if (!week) {
      return res.status(404).json({ error: "Hafta bulunamadı." });
    }
    const cells = await Cell.find({ week: Week.getWeek() });

    res.status(200).json({
      error: false,
      message: "Veri başarıyla gönderildi.",
      content: cells,
    });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const editCell = async (req, res) => {
  try {
    const updatedData = {
      lesson: req.body.lesson,
      day: req.body.day,
      title: req.body.title,
      exerciseStats: {
        total: req.body.total,
        correct: req.body.correct,
        wrong: req.body.wrong,
        empty: req.body.empty,
      },
    };
    req.body.week = Cell.getWeek();
    if (isNaN(req.body.day) || isNaN(req.body.lesson))
      return res.status(200).json({
        error: true,
        message: "Bir hata oluştu. Lütfen tekrar deneyiniz.",
      });

    const filter = {
      week: Cell.getWeek(),
      day: req.body.day,
      lesson: req.body.lesson,
    };

    const cell = await Cell.findOneAndUpdate(filter, updatedData);

    res
      .status(200)
      .json({ error: false, message: "Hücre başarıyla düzenlendi." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const getCell = async (req, res) => {
  try {
    if (isNaN(req.body.day) || isNaN(req.body.lesson))
      return res.status(200).json({
        error: true,
        message: "Bir hata oluştu. Lütfen tekrar deneyiniz.",
      });

    const cell = await Cell.findOne({
      week: Cell.getWeek(),
      day: req.body.day,
      lesson: req.body.lesson,
    }).exec();

    res.status(200).json({
      error: false,
      message: "Veri başarıyla gönderildi.",
      content: cell,
    });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const removeCell = async (req, res) => {
  try {
    if (isNaN(req.body.day) || isNaN(req.body.lesson))
      return res.status(200).json({
        error: true,
        message: "Bir hata oluştu. Lütfen tekrar deneyiniz.",
      });

    const cell = await Cell.findOneAndDelete({
      week: Cell.getWeek(),
      day: req.body.day,
      lesson: req.body.lesson,
    });

    res.status(200).json({
      error: false,
      message: "Hücre başarıyla silindi.",
    });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const createPDF = async (req, res) => {
  const cellsInCurrentWeek = await Cell.aggregate([
    {
      $lookup: {
        from: "weeks",
        localField: "week",
        foreignField: "week",
        as: "weekInfo",
      },
    },
    {
      $match: {
        "weekInfo.week": Week.getWeek(),
      },
    },
  ]);
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  
  <head>
      <style>
          table {
          border-collapse: collapse;
          width: 100%;
          border-radius: 10px;
      }
  
      th,
      td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
      }
  
      td {
          color: #333;
          font-size:10px;
          border-radius: 10px; 
      }
  
      td strong {
          font-weight: bold;
      }
      </style>
  </head>
  
  <body>
      <table>
          <thead>
              <tr>
                  <th></th>
                  <th>Pazartesi</th>
                  <th>Salı</th>
                  <th>Çarşamba</th>
                  <th>Perşembe</th>
                  <th>Cuma</th>
                  <th>Cumartesi</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>MATEMATİK</td>
                  
                  <td><strong>${cellsInCurrentWeek[0].title}</strong><br>Toplam: ${cellsInCurrentWeek[0].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[0].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[0].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[0].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[5].title}</strong><br>Toplam: ${cellsInCurrentWeek[5].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[5].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[5].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[5].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[10].title}</strong><br>Toplam: ${cellsInCurrentWeek[10].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[10].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[10].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[10].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[15].title}</strong><br>Toplam: ${cellsInCurrentWeek[15].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[15].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[15].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[15].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[20].title}</strong><br>Toplam: ${cellsInCurrentWeek[20].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[20].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[20].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[20].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[25].title}</strong><br>Toplam: ${cellsInCurrentWeek[25].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[25].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[25].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[25].exerciseStats.empty}</td>
              </tr>
              <tr>
                  <td>FİZİK</td>
                  <td><strong>${cellsInCurrentWeek[1].title}</strong><br>Toplam: ${cellsInCurrentWeek[1].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[1].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[1].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[1].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[6].title}</strong><br>Toplam: ${cellsInCurrentWeek[6].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[6].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[6].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[6].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[11].title}</strong><br>Toplam: ${cellsInCurrentWeek[11].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[11].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[11].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[11].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[16].title}</strong><br>Toplam: ${cellsInCurrentWeek[16].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[16].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[16].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[16].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[21].title}</strong><br>Toplam: ${cellsInCurrentWeek[21].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[21].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[21].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[21].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[26].title}</strong><br>Toplam: ${cellsInCurrentWeek[26].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[26].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[26].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[26].exerciseStats.empty}</td>
              </tr>
              <tr>
                  <td>KİMYA</td>
                  <td><strong>${cellsInCurrentWeek[2].title}</strong><br>Toplam: ${cellsInCurrentWeek[2].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[2].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[2].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[2].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[7].title}</strong><br>Toplam: ${cellsInCurrentWeek[7].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[7].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[7].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[7].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[12].title}</strong><br>Toplam: ${cellsInCurrentWeek[12].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[12].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[12].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[12].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[17].title}</strong><br>Toplam: ${cellsInCurrentWeek[17].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[17].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[17].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[17].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[22].title}</strong><br>Toplam: ${cellsInCurrentWeek[22].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[22].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[22].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[22].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[27].title}</strong><br>Toplam: ${cellsInCurrentWeek[27].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[27].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[27].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[27].exerciseStats.empty}</td>
              </tr>
              <tr>
                  <td>GEOMETRİ</td>
                  <td><strong>${cellsInCurrentWeek[3].title}</strong><br>Toplam: ${cellsInCurrentWeek[3].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[3].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[3].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[3].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[8].title}</strong><br>Toplam: ${cellsInCurrentWeek[8].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[8].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[8].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[8].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[13].title}</strong><br>Toplam: ${cellsInCurrentWeek[13].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[13].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[13].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[13].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[18].title}</strong><br>Toplam: ${cellsInCurrentWeek[18].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[18].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[18].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[18].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[23].title}</strong><br>Toplam: ${cellsInCurrentWeek[23].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[23].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[23].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[23].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[28].title}</strong><br>Toplam: ${cellsInCurrentWeek[28].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[28].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[28].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[28].exerciseStats.empty}</td>
              </tr>
              <tr>
                  <td>TÜRKÇE</td>
                  <td><strong>${cellsInCurrentWeek[4].title}</strong><br>Toplam: ${cellsInCurrentWeek[4].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[4].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[4].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[4].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[9].title}</strong><br>Toplam: ${cellsInCurrentWeek[9].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[9].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[9].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[9].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[14].title}</strong><br>Toplam: ${cellsInCurrentWeek[14].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[14].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[14].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[14].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[19].title}</strong><br>Toplam: ${cellsInCurrentWeek[19].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[19].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[19].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[19].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[25].title}</strong><br>Toplam: ${cellsInCurrentWeek[25].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[25].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[25].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[25].exerciseStats.empty}</td>
                  <td><strong>${cellsInCurrentWeek[29].title}</strong><br>Toplam: ${cellsInCurrentWeek[29].exerciseStats.total}<br>Doğru: ${cellsInCurrentWeek[29].exerciseStats.correct}<br>Yanlış: ${cellsInCurrentWeek[29].exerciseStats.wrong}<br>Boş: ${cellsInCurrentWeek[29].exerciseStats.empty}</td>
              </tr>
          </tbody>
      </table>
  </body>
  
  </html>
  `;

  // PDF seçeneklerini ayarlayın
  const pdfOptions = {
    format: "A4",
  };

  // HTML içeriğini PDF olarak dönüştürün
  pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
    if (err) {
      return res.status(500).send(err);
    }

    // PDF dosyasını kullanıcıya gönderin
    res.setHeader("Content-disposition", "inline; filename=belge.pdf");
    res.setHeader("Content-type", "application/pdf");
    res.send(buffer);
  });
};
module.exports = {
  getWeek,
  editCell,
  getCell,
  removeCell,
  createTable,
  createPDF,
};
