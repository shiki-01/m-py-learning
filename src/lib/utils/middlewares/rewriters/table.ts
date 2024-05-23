import {
    Card,
    Button,
    P,
    Heading,
    Span,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell
} from 'flowbite-svelte';

export function injectFlowbite(): void {
    if (document == null) {
        throw new Error(
            'document is not defined. This fn should be called after `onMount`'
        );
    }

    const cards = document.querySelectorAll('div.card');
    cards.forEach((elem) => {
        new Card({
            target: elem,
            hydrate: true
        });
    });

    const buttons = document.querySelectorAll('button.button');
    buttons.forEach((elem) => {
        new Button({
            target: elem,
            hydrate: true
        });
    });

    const paragraphs = document.querySelectorAll('p.paragraph');
    paragraphs.forEach((elem) => {
        new P({
            target: elem,
            hydrate: true
        });
    });

    const headings = document.querySelectorAll('h1.heading');
    headings.forEach((elem) => {
        new Heading({
            target: elem,
            hydrate: true
        });
    });

    const spans = document.querySelectorAll('span.span');
    spans.forEach((elem) => {
        new Span({
            target: elem,
            hydrate: true
        });
    });

    const tables = document.querySelectorAll('table');
    tables.forEach((elem) => {
        new Table({
            target: elem,
            hydrate: true
        });
    });

    const tableHeads = document.querySelectorAll('thead.table-head');
    tableHeads.forEach((elem) => {
        new TableHead({
            target: elem,
            hydrate: true
        });
    });

    const tableHeadCells = document.querySelectorAll('th.table-head-cell');
    tableHeadCells.forEach((elem) => {
        new TableHeadCell({
            target: elem,
            hydrate: true
        });
    });

    const tableBodies = document.querySelectorAll('tbody.table-body');
    tableBodies.forEach((elem) => {
        new TableBody({
            target: elem,
            hydrate: true
        });
    });

    const tableBodyRows = document.querySelectorAll('tr.table-body-row');
    tableBodyRows.forEach((elem) => {
        new TableBodyRow({
            target: elem,
            hydrate: true
        });
    });

    const tableBodyCells = document.querySelectorAll('td.table-body-cell');
    tableBodyCells.forEach((elem) => {
        new TableBodyCell({
            target: elem,
            hydrate: true
        });
    });
}