네, 맞습니다! JavaScript부터 ;까지 한 덩어리로 끊어서 각각 새 파일에 넣으시면 됩니다.

두 코드의 시작부터 끝까지 정확한 범위를 정해드릴게요.

1. 첫 번째 코드 창 (백엔드 파일: admin.js)
const express = require('express'); 부터 제일 마지막 module.exports = router; 까지 복사해서 백엔드 파일에 넣으세요.

JavaScript
const express = require('express');
const router = express.Router();
const db = require('../db'); 

router.post('/admin/users/:userId/suspend', async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: '관리자 권한이 없습니다.' });
    }

    const query = `
      UPDATE users 
      SET status = 'SUSPENDED', suspended_at = NOW(), suspend_reason = ? 
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [reason || '관리자 직권 정지', userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '해당 회원을 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      success: true,
      message: '회원이 성공적으로 정지되었습니다.',
      userId: userId,
      status: 'SUSPENDED'
    });

  } catch (error) {
    console.error('회원 정지 처리 중 에러:', error);
    return res.status(500).json({ success: false, message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;
