import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Layout, Breadcrumb, Input, Button, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import CodeMirror from 'react-codemirror'
require('codemirror/lib/codemirror.css')
require('codemirror/mode/javascript/javascript')
import * as contractActions from '../../redux/actions/contractActions'

const { Content } = Layout

const options = {
  lineNumbers: true,
  mode: 'javascript'
}

class ContractView extends React.Component {

  constructor(props) {
    super(props)
    const { location, data } = props
    const index = location.pathname.split('/')[4]

    const contract = data.contracts.find((el) => el.id === parseInt(index))
    
    this.state = {
      ...contract
    }
  }

  nameChange = (e) => {
    this.setState({ name: e.target.value })
  }

  codeChange = (code) => {
    this.setState({ code })
  }

  save = () => {
    const { contractActions, location } = this.props
    contractActions.saveContract(this.state, location.pathname.split('/')[2])
  }

  run = () => {
    this.props.contractActions.executeContract(this.state.id)
  }

  render () {
    const { name, code } = this.state
    const accountId = this.props.location.pathname.split('/')[2]
    
    return (
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item><Link to="/dashboard">Dashboard</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={`/dashboard/${accountId}`}>{accountId}</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{name}</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          <Input 
            placeholder="Enter contracts name"
            value={name}
            style={{ marginBottom: 10 }}
            onChange={this.nameChange}
          />
          <CodeMirror style={{ border: 1 }} value={code} onChange={this.codeChange} options={options} />
          <Row type="flex" justify="space-between">
            <Col><Button type="primary" icon="code" style={{ marginTop: 10 }} onClick={this.save}>Save and deploy</Button></Col>
            <Col><Button icon="right-square" style={{ marginTop: 10 }} onClick={this.run}>Run</Button></Col>
          </Row>
        </div>
      </Content>
    )
  }
}

export default connect(
  (state) => ({ data: state.contracts }),
  (dispatch) => ({ contractActions: bindActionCreators(contractActions, dispatch) })
)(ContractView)
