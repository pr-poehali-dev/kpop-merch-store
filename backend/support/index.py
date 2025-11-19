'''
Business: Support chat - create sessions, send messages, get chat history
Args: event with action (create_session, send_message, get_messages), body with user_id, message
Returns: HTTP response with session data or messages
'''

import json
import os
from typing import Dict, Any
import psycopg2
import psycopg2.extras

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create_session':
                user_id = body.get('user_id')
                
                if not user_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing user_id'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "SELECT id FROM support_sessions WHERE user_id = %s AND status = %s ORDER BY created_at DESC LIMIT 1",
                    (user_id, 'open')
                )
                existing = cur.fetchone()
                
                if existing:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'session_id': existing[0]}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO support_sessions (user_id, status) VALUES (%s, %s) RETURNING id",
                    (user_id, 'open')
                )
                conn.commit()
                session_id = cur.fetchone()[0]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'session_id': session_id}),
                    'isBase64Encoded': False
                }
            
            elif action == 'send_message':
                session_id = body.get('session_id')
                user_id = body.get('user_id')
                message = body.get('message')
                is_admin = body.get('is_admin', False)
                
                if not session_id or not user_id or not message:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Missing required fields'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO support_messages (session_id, user_id, message, is_admin) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                    (session_id, user_id, message, is_admin)
                )
                conn.commit()
                result = cur.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'message_id': result[0],
                        'created_at': result[1].isoformat()
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            session_id = params.get('session_id')
            
            if not session_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing session_id'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                SELECT m.id, m.message, m.is_admin, m.created_at, u.name 
                FROM support_messages m
                JOIN users u ON m.user_id = u.id
                WHERE m.session_id = %s
                ORDER BY m.created_at ASC
                """,
                (session_id,)
            )
            rows = cur.fetchall()
            
            messages = []
            for row in rows:
                messages.append({
                    'id': row[0],
                    'message': row[1],
                    'is_admin': row[2],
                    'created_at': row[3].isoformat(),
                    'user_name': row[4]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'messages': messages}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
