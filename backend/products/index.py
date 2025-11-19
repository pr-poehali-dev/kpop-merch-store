'''
Business: Get products with search and filtering
Args: event with queryStringParameters (search, category)
Returns: HTTP response with products list
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
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    params = event.get('queryStringParameters') or {}
    search = params.get('search', '')
    category = params.get('category', '')
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        query = "SELECT id, name, category, price, image_url, rating, reviews_count, description, stock FROM products WHERE 1=1"
        query_params = []
        
        if search:
            query += " AND (name ILIKE %s OR description ILIKE %s)"
            search_pattern = f"%{search}%"
            query_params.extend([search_pattern, search_pattern])
        
        if category and category != 'all':
            query += " AND category = %s"
            query_params.append(category)
        
        query += " ORDER BY created_at DESC"
        
        cur.execute(query, query_params)
        rows = cur.fetchall()
        
        products = []
        for row in rows:
            products.append({
                'id': row[0],
                'name': row[1],
                'category': row[2],
                'price': row[3],
                'image': row[4],
                'rating': float(row[5]) if row[5] else 0,
                'reviews': row[6],
                'description': row[7],
                'stock': row[8]
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'products': products}),
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
