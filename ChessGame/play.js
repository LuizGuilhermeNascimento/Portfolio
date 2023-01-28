var player_turn = 1, threat_king = null, name1 = "Player 1", name2 = "Player 2", checkmatte = false, check = false;
var board, team1, team2, piece_clicked = null, previous_piece = null, name_turn = null;
var squares_alt = [];
var red_color = "rgba(255, 0, 0, 0.5)", green_color = "rgba(0, 255, 0, 0.5)",
border_green_color = "rgb(0, 100, 0)", border_red_color = "rgb(100, 0, 0)";
var move_valid_passant = false;

class Piece {
    constructor(model_piece, x, y, team, number_piece, first_move, moves_num) {
        this.model_piece = model_piece;
        this.x = x;
        this.y = y;
        this.team = team;
        this.num_piece = number_piece;
        this.first_move = first_move;
        this.moves_num = moves_num
    }
    get get_model_piece() {
        return this.model_piece;
    }
    get get_x() {
        return this.x;
    }
    get get_y() {
        return this.y;
    }
    get get_team() {
        return this.team;
    }
    get get_num_piece() {
        return this.num_piece;
    }
    get get_first_move() {
        return this.first_move;
    }
    get get_moves_num() {
        return this.moves_num;
    }
}
class Board {
    constructor(matrix) {
        this.board = matrix;
    }
    get get_board() {
        return this.board;
    }
}
function create_team(num) {
    let pieces_string = [
        "castle1","knight1", "bishop1",
        "queen1", "king1", "bishop2", "knight2","castle2"  
    ]
    let team = []
    for (let i=0; i < 8; i++) {
        let p;
        if (num == 2 ) {
            p = new Piece("pawn", 1, i, num, i+1, true, 0)
            board.get_board[1][i] = p
        } else {
            p = new Piece("pawn", 6, i, num, i+1, true, 0)
            board.get_board[6][i] = p
        }
        team.push(p)
    }
    for (let i=0; i < 8; i++) {
        let piece_type = pieces_string[i].slice(0,-1)
        let piece_num = parseInt(pieces_string[i].slice(-1))
        let p;
        if (num == 2 ) {
            p = new Piece(piece_type, 0, i, num, piece_num, false, 0)
            board.get_board[0][i] = p
        } else {
            p = new Piece(piece_type, 7, i, num, piece_num, false, 0)
            board.get_board[7][i] = p
        }
        team.push(p)
    }
    return team
}
function change_player_style() {
    let p1 = document.getElementById("player1")
    let p2 = document.getElementById("player2")
    if (player_turn == 1) {
        p1.style.borderColor = "rgb(41, 232, 41)";
        p2.style.borderColor = "var(--white-alt)"
    } else {
        p2.style.borderColor = "rgb(41, 232, 41)";
        p1.style.borderColor = "var(--white-alt)"
    } 
}

function set_players_name(n1, n2) {
    if (n1 != "") { name1 = n1 }
    if (n2 != "") { name2 = n2 }
    document.getElementById("player_name1").innerHTML = name1
    document.getElementById("player_name2").innerHTML = name2
}

function start() {
    let matrix = [];
    for (let i=0; i < 8; i++) {
        matrix[i] = [];
        for (let j=0; j < 8; j++) {
            matrix[i][j] = null;
        }
    }
    board = new Board(matrix);
    console.log(board)
    team1 = create_team(1);
    team2 = create_team(2);
    player_turn = 1;
    change_player_style()
    n1 = prompt("Insert name of Player1 (max of 8 characters):")
    n2 = prompt("Insert name of Player2 (max of 8 characters):")
    set_players_name(n1, n2)
    alert("Have a good match!")
    name_turn = name1
    change_player_style()
}


function verify_positions(pos_x, pos_y, team) {
    if ( pos_x >= 0 && pos_x < 8 && pos_y >= 0 && pos_y < 8) {
        if (board.get_board[pos_x][pos_y] == null) {
            return [pos_x, pos_y, "empty"]
        }
        if (board.get_board[pos_x][pos_y].get_team != team) {
            if (board.get_board[pos_x][pos_y].model_piece == "king") {
                return [pos_x, pos_y, "attack_king"]
            }
            return [pos_x, pos_y, "attack"]
        }  
    }
    return null;
}

function pawn_positions(piece, x, y, team) {
    let pos = [];
    let s;
    let first_pos;
    if (team == 1) {
        first_pos = verify_positions(x-1, y, 1)
        if (first_pos != null && first_pos[2] == "empty") {
            pos.push(first_pos)
            if (piece.first_move) {
                s = verify_positions(x-2, y, 1)
                if (s != null && s[2] != "attack") { pos.push(s) }
            }
        }
        s = verify_positions(x-1, y+1, 1)
        if (s != null && s[2] == "attack") { pos.push(s) }
        s = verify_positions(x-1, y-1, 1)
        if (s != null && s[2] == "attack") { pos.push(s) }

    } else if (team == 2) {

        first_pos = verify_positions(x+1, y, 2)
        if (first_pos != null && first_pos[2] == "empty") {
            pos.push(first_pos)
            if (piece.first_move) {
                s = verify_positions(x+2, y, 2)
                if (s != null && s[2] != "attack") { pos.push(s) }
            }
        }
        s = verify_positions(x+1, y+1, 2)
        if (s != null && s[2] == "attack") { pos.push(s) }
        s = verify_positions(x+1, y-1, 2)
        if (s != null && s[2] == "attack") { pos.push(s) }
    }
    return pos;
}

function castle_positions(x, y, team) {
    let pos = []
    // casas à direita
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x+i, y, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    // casas à esquerda
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x-i, y, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    // casas acima
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x, y+i, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    // casas abaixo
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x, y-i, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    return pos
}

function bishop_positions(x, y, team) {
    let pos = []
    // diagonais à direita acima
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x+i, y+i, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    // diagonais à esquerda acima
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x-i, y+i, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    // diagonais à direita abaixo
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x+i, y-i, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    // diagonais à esquerda abaixo
    for (let i = 1; i <= 8; i++) {
        let v = verify_positions(x-i, y-i, team);
        pos.push(v)
        if (v == null || v[2] == "attack") { break }
    }
    return pos
}

function knight_positions(x, y, team) {
    let pos = [
        verify_positions(x+1, y+2, team),
        verify_positions(x-1, y+2, team),
        verify_positions(x+1, y-2, team),
        verify_positions(x-1, y-2,team),
        verify_positions(x+2, y+1,team),
        verify_positions(x+2, y-1,team),
        verify_positions(x-2, y+1,team),
        verify_positions(x-2, y-1,team)
    ]
    return pos
}
function queen_positions(x, y, team) {
    let castle_move = castle_positions(x, y, team)
    let bishop_move = bishop_positions(x, y, team);
    return castle_move.concat(bishop_move);
}

function king_positions(x, y, team) {
    let pos = [
        verify_positions(x+1, y+1, team),
        verify_positions(x+1, y, team),
        verify_positions(x+1, y-1, team),
        verify_positions(x, y-1, team),
        verify_positions(x-1, y-1, team),
        verify_positions(x-1, y, team),
        verify_positions(x-1, y+1, team),
        verify_positions(x, y+1, team)
    ]
    return pos
}

function get_possible_positions(x_pos, y_pos) {
    let piece = board.get_board[x_pos][y_pos];
    let team = piece.get_team;
    switch(piece.get_model_piece) {
        case "pawn":
            return pawn_positions(piece, x_pos, y_pos, team);
        case "castle":
            return castle_positions(x_pos, y_pos, team);
        case "bishop":
            return bishop_positions(x_pos, y_pos, team);
        case "knight":
            return knight_positions(x_pos, y_pos, team);
        case "queen":
            return queen_positions(x_pos, y_pos, team);
        case "king":
            return king_positions(x_pos, y_pos, team);
    }
}

function change_color_square(x, y, color, border_color) {
    let id_square = "l"+(x+1).toString()+"c"+(y+1).toString()
    let square = document.getElementById(id_square)
    square.style.backgroundColor = color;
    square.style.borderColor = border_color
    squares_alt.push([x,y])
}

function revert_color_square() {
    if (squares_alt == []) { return; }
    for (let j = 0; j < squares_alt.length; j++) {
        let x = squares_alt[j][0]
        let y = squares_alt[j][1]
        let id_square = "l"+(x+1).toString()+"c"+(y+1).toString()
        if ((x+y) % 2 == 0) {
            document.getElementById(id_square).style.backgroundColor = "var(--soft-blue)";
        } else {
            document.getElementById(id_square).style.backgroundColor = "var(--white-alt)"
        }
        document.getElementById(id_square).style.borderColor = "var(--soft-blue)";
    }
    squares_alt = []
}

function verify_checkmate(adv) {
    checkmatte = false;
    check = false;
    let threat_name = "";
    let champion = "";
    if (adv == 1) {
        champion = name1
        threat_name = name2
    } else {
        champion = name2
        threat_name = name1
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board.get_board[i][j] == null || board.get_board[i][j].get_team != adv) { continue }
            if (threat_king == null) {
                let possible_pos = get_possible_positions(i, j, board.get_board[i][j].get_team)
                for (let i = 0; i < possible_pos.length; i++) {
                    if (possible_pos[i] != null && possible_pos[i][2] == "attack_king") { 
                        threat_king = board.get_board[possible_pos[i][0]][possible_pos[i][1]]
                        check = true;
                        break
                    }
                }
            }
        }
    }
    if (threat_king != null) {
        let pos_king = king_positions(threat_king.get_x, threat_king.get_y, threat_king.get_team)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                checkmatte = true
                if (board.get_board[i][j] == null || board.get_board[i][j].get_team != adv) { continue }
                let possible_pos = get_possible_positions(i, j, board.get_board[i][j].get_team)
                for (let i = 0; i < possible_pos.length; i++) {
                    if (possible_pos[i] == null) { continue }
                    for(let k = 0; k < pos_king.length; k++) {
                        if (pos_king[k] == null) { continue }
                        if (possible_pos[i][0] == pos_king[k][0] && possible_pos[i][1] == pos_king[k][1]) {
                            pos_king[k] = null;
                        }
                    }
                }
                for(let k = 0; k < pos_king.length; k++) {
                    if (pos_king[k] != null) {
                        checkmatte = false;
                        break
                    }
                }
                if (checkmatte) {
                    alert("XEQUE MATTE!!\n"+champion+" ganhou o jogo");
                    window.location.href = "menu.html"
                    return;
                }
            }
        }
    }
    if (check) {
        alert("Xeque!!\nO rei de "+threat_name+" está ameaçado!")
    }
    threat_king = null
}

function verify_subpromotion(pawn) {
    if (pawn != null && pawn.model_piece == "pawn" &&
        ((pawn.get_team == 1 && pawn.get_x == 0) || 
        (pawn.get_team == 2 && pawn.get_x == 7))) {
        return true;
    }
    return false;
}

function make_subpromotion(x, y) {
    let message = "Sub promotion! One of your pawns has reached the opposite end of the board!\n"+
        "Now, you can choose a piece to promote your pawn:\n"+
        "\"pawn\": pawn\n\"queen\": queen\n\"knight\": knight\n\"bishop\": bishop\n\"castle\": rook\n"+
        "Enter one of the names above to choose your part:"
    let p_to_promo = prompt(message)
    let prefix_team = ""
    let color_team = ""
    let piece = board.get_board[x][y]
    if (piece.team == 1) {
        color_team = "team_white"
        prefix_team = "w"
    } else { 
        color_team = "team_black" 
        prefix_team = "b"
    }
    img = document.getElementById(prefix_team+"_"+piece.model_piece+piece.num_piece) 
    board.get_board[x][y].model_piece = p_to_promo
    img.src = "images/"+color_team+"/"+p_to_promo+"1.png"

}

function verify_en_passant(pos, previous_piece, actual_piece) {
    if (piece_clicked == null) { return pos }
    if (previous_piece.get_x == actual_piece.get_x && previous_piece.get_y == actual_piece.get_y) {
        return pos
    }
    if (previous_piece.model_piece != "pawn" || actual_piece.model_piece != "pawn") {
        return pos
    }
    if (previous_piece.moves_num != 1) { 
        return pos 
    }
    if (actual_piece.get_x == previous_piece.get_x && Math.abs(actual_piece.get_y - previous_piece.get_y) == 1) {
        let step = -1;
        if (actual_piece.get_team == 2) { step = 1 }
        if (previous_piece.get_x+step >= 0 && previous_piece.get_x+step < 8) {
            pos.push([previous_piece.get_x+step, previous_piece.get_y, "attack"])
        }
    }
    return pos
}


function click_piece(elem) {
    if (elem.parentNode.style.backgroundColor != red_color) {
        let x_pos = parseInt(elem.parentNode.id[1])-1;
        let y_pos = parseInt(elem.parentNode.id[3])-1;
        if (board.get_board[x_pos][y_pos].get_team != player_turn) { return; }
        revert_color_square();
        

        if (piece_clicked == null) {
            piece_clicked = board.get_board[x_pos][y_pos]
        } else if (piece_clicked.get_x == x_pos && piece_clicked.get_y == y_pos) {
            piece_clicked = null;
            return;
        }
        if (previous_piece == null) {
            previous_piece = board.get_board[x_pos][y_pos];
        }

        piece_clicked = board.get_board[x_pos][y_pos]

        pos_to_change = get_possible_positions(x_pos, y_pos);
        pos_to_change = verify_en_passant(pos_to_change, previous_piece, piece_clicked)
        

        for (let i = 0; i < pos_to_change.length; i++) {
            let pos = pos_to_change[i]
            if (pos == null) { continue }
            let color;
            let border_color;
            if (pos[2] == "empty") {
                color = green_color
                border_color = border_green_color
            } else if (pos[2] == "attack") {
                color = red_color
                border_color = border_red_color
            }
            
            change_color_square(pos[0], pos[1], color, border_color)
        }
    } else {
        
        let x_pos = parseInt(elem.parentNode.id[1])-1;
        let y_pos = parseInt(elem.parentNode.id[3])-1;
        board.get_board[piece_clicked.get_x][piece_clicked.get_y].moves_num++;
        let id_origin = "l"+(piece_clicked.get_x+1).toString()+"c"+(piece_clicked.get_y+1).toString()
        let id_destiny = elem.parentNode.id 
        swap_position([parseInt(id_origin[1])-1, parseInt(id_origin[3])-1], [x_pos, y_pos])
        revert_color_square();
        elem.parentNode.removeChild(elem)
        setPositionElement(id_origin, id_destiny)


        if (verify_subpromotion(board.get_board[x_pos][y_pos])) {
            make_subpromotion(x_pos, y_pos, id_destiny)
        }
        previous_piece = piece_clicked
        piece_clicked = null
        if (player_turn == 1) {
            name_turn = name2
            player_turn = 2
            change_player_style()
        } else {
            player_turn = 1
            name_turn = name1
            change_player_style()
        }
    }
}

function setPositionElement(id_origin, id_destiny) {
    let origin = document.getElementById(id_origin)
    let destiny = document.getElementById(id_destiny)
    let destiny_childs = Array.prototype.slice.call(origin.children)
    destiny_childs.forEach(function(elem, index) {
        destiny.appendChild(elem)
    })
}

function swap_position(origin, destiny) {

    if (board.get_board[origin[0]][origin[1]].first_move) {
        board.get_board[origin[0]][origin[1]].first_move = false;
    }
    board.get_board[origin[0]][origin[1]].x = destiny[0]
    board.get_board[origin[0]][origin[1]].y = destiny[1]
    board.get_board[destiny[0]][destiny[1]] = board.get_board[origin[0]][origin[1]]
    board.get_board[origin[0]][origin[1]] = null;

}

function click_square(elem) {
    if(elem.style.backgroundColor != green_color && elem.style.backgroundColor != red_color ) { return; }
    let x = piece_clicked.get_x
    let y = piece_clicked.get_y
    board.get_board[x][y].moves_num++;
    let id_origin = "l"+(x+1).toString()+"c"+(y+1).toString()
    let id_destiny = elem.id 

    if(elem.style.backgroundColor == green_color) {
        if (verify_subpromotion(board.get_board[parseInt(id_destiny[1])-1][parseInt(id_destiny[3])-1])) {
            make_subpromotion(parseInt(id_destiny[1])-1, parseInt(id_destiny[3])-1, id_destiny)
        }
    } else if (elem.style.backgroundColor == red_color) {
        let prefix_team = "w"
        if (previous_piece.get_team == 2) { 
            prefix_team = "b"
        }
        let to_del = document.getElementById(prefix_team+"_"+previous_piece.model_piece+previous_piece.num_piece)
        to_del.parentNode.removeChild(to_del)
        board.get_board[previous_piece.get_x][previous_piece.get_y] = null
        alert(name_turn+" made a En Passant!")
    }
    revert_color_square();
    setPositionElement(id_origin, id_destiny)
    swap_position([x,y], [parseInt(id_destiny[1])-1, parseInt(id_destiny[3])-1])
    previous_piece = piece_clicked
    piece_clicked = null;

    if (player_turn == 1) {
        player_turn = 2
        name_turn = name2
        change_player_style()
    } else {
        player_turn = 1
        name_turn = name1
        change_player_style()
    } 
    verify_checkmate(1)
    if (checkmatte) { return; }
    verify_checkmate(2)
}
