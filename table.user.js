// ==UserScript==
// @name         테이블 데이터 추출 및 고정 테이블 생성
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  웹페이지에서 특정 테이블 셀 데이터를 추출하여 상단 좌측에 고정 테이블을 생성합니다
// @author       Your Name
// @match        *://*/table.html
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // 스타일 생성
    const style = document.createElement('style');
    style.textContent = `
        .fixed-table-container {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .fixed-table {
            border-collapse: collapse;
            width: auto;
        }
        
        .fixed-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        
        .fixed-table caption {
            font-weight: bold;
            padding: 8px;
            background-color: #f8f8f8;
            border-bottom: 1px solid #ddd;
        }
    `;
    document.head.appendChild(style);

    // 지정된 테이블과 셀에서 데이터 추출
    function extractCellData() {
        const tables = document.querySelectorAll('.table-container table');
        const data = [];

        if (tables.length >= 4) {
            // 테이블 1의 2행 1열 (입고 날짜)
            data.push(tables[0].rows[1].cells[0].textContent.trim());

            // 테이블 2의 2행 3열 (재고)
            data.push(tables[1].rows[1].cells[2].textContent.trim());

            // 테이블 3의 2행 1열 (상품 코드)
            data.push(tables[2].rows[1].cells[0].textContent.trim());

            // 테이블 4의 2행 3열 (처리 날짜)
            data.push(tables[3].rows[1].cells[2].textContent.trim());
        }

        return data;
    }

    // 고정 테이블 생성 및 추가
    function createFixedTable(data) {
        const container = document.createElement('div');
        container.className = 'fixed-table-container';

        const table = document.createElement('table');
        table.className = 'fixed-table';

        const caption = document.createElement('caption');
        caption.textContent = '요약 정보';
        table.appendChild(caption);

        const tbody = document.createElement('tbody');
        const row = document.createElement('tr');

        // 데이터를 하나의 행에 모두 표시
        data.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });

        tbody.appendChild(row);
        table.appendChild(tbody);
        container.appendChild(table);
        document.body.appendChild(container);
    }

    // 메인 실행 함수
    function main() {
        const data = extractCellData();
        if (data.length > 0) {
            createFixedTable(data);
        }
    }

    // 실행
    setTimeout(main, 500);
})(); 