module.exports = function solveSudoku(matrix) {
    return display(solve(matrix));
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
const units = new Map();
squares.forEach(s => {
    units.set(s, unitlist.filter(u => u.includes(s)));
});
const peers = new Map();
squares.forEach(s => {
    const peersSet = new Set();
    units.get(s).forEach(x => {
        x.forEach(y => {
            peersSet.add(y)
        });
    });
    peersSet.delete(s);
    peers.set(s, peersSet);
});

parse_grid = (grid) => {
    const values = new Map();
    squares.forEach(s => {
        values.set(s, digits);
    });
    grid_values(grid).forEach((d, s) => {
        if (digits.includes(d) && !assign(values, s, d)) {
            return false;
        };
    });
    return values;
};

grid_values = (grid) => {
    const starting_grid = new Map();
    squares.forEach((s, i) => {
        starting_grid.set(s, grid[Math.floor(i / 9)][i % 9]);
    });
    return starting_grid;
};

assign = (values, s, d) => {
    const other_values = values.get(s).replace(d, '');
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
    if (!values.get(s).includes(d)) {
        return values;
    }
    values.set(s, values.get(s).replace(d, ''));
    const value = values.get(s);
    if (value.length == 0) {
        return false;
    } else if (value.length == 1) {
        const d2 = value;
        const condition = [...peers.get(s)].every(s2 => {
            return eliminate(values, s2, d2);
        });
        if (!condition) {
            return false;
        }
    }

    units.get(s).forEach(u => {
        const dplaces = u.filter(s => {
            return values.get(s).includes(d);
        });
        if (dplaces.length == 0) {
            return false;
        } else if (dplaces.length == 1) {
            if (!assign(values, dplaces[0], d)) {
                return false;
            }
        }
    });
    return values;
};

display = (values) => {
    let iterator = values.values();
    const result = initial.slice();
    result.forEach((x, i) => {
        x.forEach((y, j) => {
            result[i][j] = +iterator.next().value;
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
        return values.get(s).length == 1;
    });
    if (condition) {
        return values;
    }
    const min = Math.min(...squares.map(s => {
        const len = values.get(s).length;
        return len > 1 ? len : 9;
    }));
    const i = squares.findIndex(s => values.get(s).length == min);
    const s = squares[i];
    const valuesCopy = new Map();
    values.forEach((val, key) => {
        valuesCopy.set(key, val);
    });
    const seq = values.get(s).split('').map(d => {
        return search(assign(valuesCopy, s, d));
    });
    return some(seq);

};

some = (seq) => {
    for (let e in seq) {
        if (seq[e]) return seq[e];
    }
    return false;
};

const initial = [
    [0, 5, 0, 0, 7, 0, 0, 0, 1],
    [8, 7, 6, 0, 2, 1, 9, 0, 3],
    [0, 0, 0, 0, 3, 5, 0, 0, 0],
    [0, 0, 0, 0, 4, 3, 6, 1, 0],
    [0, 4, 0, 0, 0, 9, 0, 0, 2],
    [0, 1, 2, 0, 5, 0, 0, 0, 4],
    [0, 8, 9, 0, 6, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 7, 0, 0, 0],
    [1, 6, 7, 0, 0, 2, 5, 4, 0]
  ];