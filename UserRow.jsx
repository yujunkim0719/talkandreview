JavaScript
import React, { useState } from 'react';
import axios from 'axios';

function UserRow({ user }) {
  const [status, setStatus] = useState(user.status);
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    if (!window.confirm(`${user.name} 회원을 즉시 정지하시겠습니까?`)) return;

    setLoading(true);

    try {
      const response = await axios.post(`/api/admin/users/${user.id}/suspend`, {
        reason: '관리자에 의한 즉시 정지'
      });

      if (response.data.success) {
        setStatus('SUSPENDED');
        alert('회원이 정지되었습니다.');
      }
    } catch (error) {
      console.error('정지 처리 실패:', error);
      alert(error.response?.data?.message || '정지 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <span>{user.name} ({user.email})</span>
      <span>상태: <strong>{status}</strong></span>
      
      <button 
        onClick={handleSuspend} 
        disabled={loading || status === 'SUSPENDED'}
        style={{
          backgroundColor: status === 'SUSPENDED' ? '#ccc' : '#dc3545',
          color: '#fff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: status === 'SUSPENDED' ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '처리 중...' : status === 'SUSPENDED' ? '정지됨' : '즉시 정지'}
      </button>
    </div>
  );
}

export default UserRow;
