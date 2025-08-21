const { CronJob } = require("cron");

const { Op } = require("sequelize");
const { Messages, ArchivedMessages } = require("../modals");

const archiveOldMessages = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 10 * 1000);

    const oldMessages = await Messages.findAll({
      where: {
        createdAt: { [Op.lt]: oneDayAgo },
      },
    });

    if (oldMessages.length > 0) {
      await ArchivedMessages.bulkCreate(
        oldMessages.map((msg) => ({
          id: msg.id,
          message: msg.message,
          fileUrl: msg.fileUrl,
          UserId: msg.UserId,
          GroupId: msg.GroupId,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
        }))
      );

      await Messages.destroy({
        where: { id: oldMessages.map((m) => m.id) },
      });

      console.log(`Archived ${oldMessages.length} messages`);
    }
  } catch (error) {
    console.log("archived messages from cron error:", error);
  }
};

const archivedJob = new CronJob(
  "*/10 * * * *",
  archiveOldMessages,
  null,
  true,
  "Asia/Kolkata"
);

module.exports = { archivedJob };
