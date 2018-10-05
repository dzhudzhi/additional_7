module.exports = function solveSudoku(matrix) {
    return output(solve(matrix));
}

cross = (A, B) => {
    let C = [];
    A.forEach(a => {
        B.forEach(b => {
            C.push(a + b);
        })
    })
    return C;
};

const digits = '123456789';
const rows = ['A','B','C','D','E','F','G','H','I'];
const cols = ['1','2','3','4','5','6','7','8','9'];
const squares  = cross(rows, cols);

const unitlist = [];
cols.forEach(c => {
    unitlist.push(cross(rows, [c]));
});
rows.forEach(r => {
    unitlist.push(cross([r], cols));
});
const rrows = [['A','B','C'], ['D','E','F'], ['G','H','I']];
const ccols = [['1','2','3'], ['4','5','6'], ['7','8','9']];
rrows.forEach(rs => {
    ccols.forEach(cs => {
        unitlist.push(cross(rs, cs));
    });
});
const units = {};
squares.forEach(s => {
    units[s] = unitlist.filter(u => u.includes(s));
});
const peers = {};
squares.forEach(s => {
    peers[s] = [];
    units[s].forEach(x => {
        x.forEach(y => {
            if (!peers[s].includes(y) && y != s) {
                peers[s].push(y);
            }
        });
    });
});

parse_grid = (grid) => {
    const values = {};
    squares.forEach(s => {
        values[s] = digits;
    });
    const startingGrid = grid_values(grid);
    for (let s in startingGrid) {
        const d = startingGrid[s];
        if (digits.includes(d) && !assign(values, s, d)) {
            return false;
        };
    };
    return values;
};

grid_values = (grid) => {
    const starting_grid = {};
    squares.forEach((s, i) => {
        starting_grid[s] = grid[Math.floor(i / 9)][i % 9];
    });
    return starting_grid;
};

assign = (values, s, d) => {
    const other_values = values[s].replace(d, '');
    const condition = other_values.split('').every(d2 => {
        return eliminate(values, s, d2);
    });
    if (condition) {
        return values;
    } else {
        return false;
    }
};

eliminate = (values, s, d) => {
    if (!values[s].includes(d)) {
        return values;
    }
    values[s] = values[s].replace(d, '');
    if (values[s].length == 0) {
        return false;
    } else if (values[s].length == 1) {
        const d2 = values[s];
        const condition = [...peers[s]].every(s2 => {
            return eliminate(values, s2, d2);
        });
        if (!condition) {
            return false;
        }
    }

    for (let u in units[s]) {
        const dplaces = units[s][u].filter(x => {
            return values[x].includes(d);
        });
        if (dplaces.length == 0) {
            return false;
        } else if (dplaces.length == 1) {
            if (!assign(values, dplaces[0], d)) {
                return false;
            }
        }
    };
    return values;
};

output = (values) => {
    const result = initial.slice();
    let s = '';
    result.forEach((x, i) => {
        x.forEach((y, j) => {
            s = squares[9 * i + j];
            result[i][j] = +values[s];
        });
    });
    return result;
};

solve = (grid) => search(parse_grid(grid));

search = (values) => {
    if (values == false) {
        return false;
    }
    const condition = squares.every(s => {
        return values[s].length == 1;
    });
    if (condition) {
        return values;
    }
    const min = Math.min(...squares.map(s => {
        const len = values[s].length;
        return len > 1 ? len : 9;
    }));
    const i = squares.findIndex(s => values[s].length == min);
    const s = squares[i];
    const seq = values[s].split('').map(d => {
        const valuesCopy = Object.assign({}, values);
        return search(assign(valuesCopy, s, d));
    });
    return some(seq);

};

some = (seq) => {
    for (let e in seq) {
        if (seq[e]) return seq[e];
    }
    return false;
}

const initial = [
    [0, 0, 2, 0, 0, 9, 0, 0, 4],
    [0, 1, 5, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 4, 1, 8, 0, 5],
    [0, 8, 0, 5, 0, 7, 0, 4, 0],
    [5, 0, 9, 8, 6, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 8, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 9, 0],
    [6, 0, 0, 7, 0, 0, 3, 0, 0]
  ];